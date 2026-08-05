"""Visuals.

Free image endpoints churn constantly — Pollinations' anonymous tier stopped
serving in 2026 and now returns 402 for every model — so this is a provider
chain rather than one hardcoded URL. Providers are tried in order and the
first one that returns bytes wins; a total failure degrades to a generated
card so a long batch never dies on one bad request.

Providers, all free, in the order they are attempted:

  pollinations  POLLINATIONS_TOKEN   free tier ~1.5 pollen/week (~15k images)
                                     https://auth.pollinations.ai
  cloudflare    CF_ACCOUNT_ID +      free tier 10k neurons/day, FLUX-1-schnell
                CF_API_TOKEN         https://dash.cloudflare.com -> Workers AI
  gemini        GEMINI_API_KEY       opt-in only (--images gemini): image models
                                     are not always free-tier, unlike text
  placeholder   -                    procedural card, no network

Set BRAINROT_IMAGES or pass --images to pin one provider.
"""

import base64
import hashlib
import os
import time
from pathlib import Path
from urllib.parse import quote

import requests

from . import config, ffmpeg

GEN_WIDTH = 864          # upscaled during the Ken Burns pass
GEN_HEIGHT = 1536
RETRIES = 2
TIMEOUT = 150

NEGATIVE = "no text, no words, no letters, no captions, no watermark, no logo"


def build_prompt(image_prompt: str, series: dict) -> str:
    return f"{image_prompt}. Style: {series['art_style']}. {NEGATIVE}."


# --------------------------------------------------------------------------
# Providers. Each returns image bytes or None.
# --------------------------------------------------------------------------

def _pollinations(prompt: str, seed: int) -> bytes | None:
    token = os.environ.get("POLLINATIONS_TOKEN")
    if not token:
        return None
    response = requests.get(
        "https://gen.pollinations.ai/image/" + quote(prompt[:1400], safe=""),
        params={
            "model": os.environ.get("POLLINATIONS_MODEL", "flux"),
            "width": GEN_WIDTH,
            "height": GEN_HEIGHT,
            "seed": seed,
            "nologo": "true",
        },
        headers={"Authorization": f"Bearer {token}"},
        timeout=TIMEOUT,
    )
    if response.status_code == 200 and response.headers.get("content-type", "").startswith("image"):
        return response.content
    return None


def _cloudflare(prompt: str, seed: int) -> bytes | None:
    account = os.environ.get("CF_ACCOUNT_ID")
    token = os.environ.get("CF_API_TOKEN")
    if not (account and token):
        return None
    model = os.environ.get("CF_IMAGE_MODEL", "@cf/black-forest-labs/flux-1-schnell")
    response = requests.post(
        f"https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/{model}",
        headers={"Authorization": f"Bearer {token}"},
        json={"prompt": prompt[:2000], "seed": seed, "steps": 6},
        timeout=TIMEOUT,
    )
    if response.status_code != 200:
        return None
    if response.headers.get("content-type", "").startswith("image"):
        return response.content
    encoded = (response.json().get("result") or {}).get("image")
    return base64.b64decode(encoded) if encoded else None


def _gemini(prompt: str, seed: int) -> bytes | None:
    if not config.GEMINI_API_KEY:
        return None
    response = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        params={"key": config.GEMINI_API_KEY},
        json={
            "model": os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-lite-image"),
            "input": [{"type": "text", "text": prompt[:2000]}],
            "response_format": {
                "type": "image",
                "mime_type": "image/jpeg",
                "aspect_ratio": "9:16",
            },
        },
        timeout=TIMEOUT,
    )
    if response.status_code != 200:
        return None
    body = response.json()
    encoded = (body.get("output_image") or {}).get("data")
    if not encoded:
        for item in body.get("output", []):
            if item.get("type") == "image" and item.get("data"):
                encoded = item["data"]
                break
    return base64.b64decode(encoded) if encoded else None


PROVIDERS = {
    "pollinations": _pollinations,
    "cloudflare": _cloudflare,
    "gemini": _gemini,
}

# gemini is excluded from the automatic chain: unlike its text models, its image
# models are not reliably free tier, and this pipeline promises a zero-cost run.
AUTO_CHAIN = ["pollinations", "cloudflare"]


def chain() -> list[str]:
    pinned = os.environ.get("BRAINROT_IMAGES")
    if pinned and pinned != "auto":
        return [p for p in pinned.split(",") if p in PROVIDERS]
    return AUTO_CHAIN


def available() -> str:
    """What the current environment can actually reach, for the run banner."""
    ready = []
    if os.environ.get("POLLINATIONS_TOKEN"):
        ready.append("pollinations")
    if os.environ.get("CF_ACCOUNT_ID") and os.environ.get("CF_API_TOKEN"):
        ready.append("cloudflare")
    if os.environ.get("BRAINROT_IMAGES") == "gemini" and config.GEMINI_API_KEY:
        ready.append("gemini")
    return ", ".join(ready) if ready else "none configured — placeholder cards only"


# --------------------------------------------------------------------------

def fetch(image_prompt: str, series: dict, dst: Path, seed: int) -> Path:
    """Produce one still. Cached by prompt+seed, so re-runs and the second
    hook variant cost nothing."""
    prompt = build_prompt(image_prompt, series)
    key = hashlib.sha1(f"{prompt}|{seed}".encode()).hexdigest()[:16]
    cached = dst.parent / f"cache_{key}.jpg"
    dst.parent.mkdir(parents=True, exist_ok=True)

    if cached.exists() and cached.stat().st_size > 4096:
        dst.write_bytes(cached.read_bytes())
        return dst

    for name in chain():
        provider = PROVIDERS[name]
        for attempt in range(RETRIES):
            try:
                data = provider(prompt, seed)
            except requests.RequestException:
                data = None
            if data and len(data) > 4096:
                cached.write_bytes(data)
                dst.write_bytes(data)
                return dst
            if attempt < RETRIES - 1:
                time.sleep(3 * (attempt + 1))

    placeholder(dst, seed)
    return dst


def placeholder(dst: Path, seed: int) -> None:
    """A dark textured card, so a missing provider degrades instead of crashing."""
    hue = (seed * 37) % 360
    ffmpeg.run([
        "-f", "lavfi",
        "-i", f"color=c=black:s={GEN_WIDTH}x{GEN_HEIGHT}",
        "-vf",
        (
            f"geq=r='40+30*sin(X/90+{hue})':g='30+25*sin(Y/110)':b='60+40*sin((X+Y)/140)',"
            "noise=alls=22:allf=t,vignette,format=yuv420p"
        ),
        "-frames:v", "1",
        str(dst),
    ])
