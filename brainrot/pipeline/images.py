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
  aihorde       nothing at all       crowdsourced GPUs, anonymous key works.
                                     Slower and lower fidelity than the two
                                     above, but it needs no signup, so it is
                                     what makes a clean checkout produce real
                                     visuals instead of placeholder cards.
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

NEGATIVE = "text, words, letters, captions, watermark, logo, signature"


def build_prompt(image_prompt: str, series: dict) -> str:
    return f"{image_prompt}. Style: {series['art_style']}."


def negative_for(series: dict) -> str:
    """What must not appear. Diffusion models ignore "no X" in a positive
    prompt, so anything a series wants excluded belongs here instead."""
    extra = series.get("negative", "")
    return f"{NEGATIVE}, {extra}" if extra else NEGATIVE


# --------------------------------------------------------------------------
# Single-shot providers. Each returns image bytes or None.
# --------------------------------------------------------------------------

def _pollinations(prompt: str, seed: int, negative: str) -> bytes | None:
    token = os.environ.get("POLLINATIONS_TOKEN")
    if not token:
        return None
    response = requests.get(
        "https://gen.pollinations.ai/image/" + quote(f"{prompt} No {negative}."[:1400], safe=""),
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


def _cloudflare(prompt: str, seed: int, negative: str) -> bytes | None:
    account = os.environ.get("CF_ACCOUNT_ID")
    token = os.environ.get("CF_API_TOKEN")
    if not (account and token):
        return None
    model = os.environ.get("CF_IMAGE_MODEL", "@cf/black-forest-labs/flux-1-schnell")
    response = requests.post(
        f"https://api.cloudflare.com/client/v4/accounts/{account}/ai/run/{model}",
        headers={"Authorization": f"Bearer {token}"},
        json={"prompt": f"{prompt} No {negative}."[:2000], "seed": seed, "steps": 6},
        timeout=TIMEOUT,
    )
    if response.status_code != 200:
        return None
    if response.headers.get("content-type", "").startswith("image"):
        return response.content
    encoded = (response.json().get("result") or {}).get("image")
    return base64.b64decode(encoded) if encoded else None


def _gemini(prompt: str, seed: int, negative: str) -> bytes | None:
    if not config.GEMINI_API_KEY:
        return None
    response = requests.post(
        "https://generativelanguage.googleapis.com/v1beta/interactions",
        params={"key": config.GEMINI_API_KEY},
        json={
            "model": os.environ.get("GEMINI_IMAGE_MODEL", "gemini-3.1-flash-lite-image"),
            "input": [{"type": "text", "text": f"{prompt} No {negative}."[:2000]}],
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


# --------------------------------------------------------------------------
# AI Horde. Batched, because it is a queue: submitting all beats at once and
# waiting on them together turns a per-image wait into a single one.
# --------------------------------------------------------------------------

HORDE = "https://aihorde.net/api/v2"
HORDE_WAVE = 8           # in-flight submissions before pausing
HORDE_POLL = 5
HORDE_DEADLINE = 900

# Dimensions must be multiples of 64, and an anonymous key has to pay kudos
# up front for anything past roughly 629x629 — which 512x896 exceeds, so it is
# rejected outright once the free allowance is spent. 448x768 is the largest
# valid 9:16-ish size that stays inside it, and RealESRGAN doubles it back to
# 896x1536 on the worker for two more kudos. Quality tiers are tried in order
# because the anonymous allowance moves around during the day.
HORDE_TIERS = [
    {"width": 448, "height": 768, "steps": 20, "post_processing": ["RealESRGAN_x2plus"]},
    {"width": 448, "height": 768, "steps": 16},
    {"width": 448, "height": 768, "steps": 8},
]


def _horde_headers() -> dict:
    return {
        "apikey": os.environ.get("AIHORDE_API_KEY", "0000000000"),
        "Client-Agent": "brainrot-pipeline:1.0:github.com/ygxdrasil/For-u",
    }


def _horde_submit(
    prompt: str, seed: int, models: list[str], negative: str, reported: set
) -> str | None:
    for tier in HORDE_TIERS:
        payload = {
            "prompt": f"{prompt} ### {negative}",
            "params": {
                **tier,
                "n": 1,
                "cfg_scale": 5.0,
                "sampler_name": "k_euler_a",
                "seed": str(seed),
            },
            "nsfw": False,
        }
        if models:
            payload["models"] = models

        for attempt in range(4):
            try:
                response = requests.post(
                    f"{HORDE}/generate/async", headers=_horde_headers(), json=payload, timeout=60
                )
            except requests.RequestException as exc:
                _report(reported, f"network error talking to the horde: {exc}")
                return None

            if response.status_code in (200, 202):
                return response.json().get("id")
            if response.status_code == 429:       # too many pending for this key
                time.sleep(10 * (attempt + 1))
                continue

            body = response.json() if response.content else {}
            reason = body.get("rc") or body.get("message") or response.status_code
            if body.get("rc") == "KudosUpfront":
                # Anonymous allowance is spent for this quality; drop a tier.
                _report(reported, f"horde: {reason} — falling back to a cheaper tier")
                break
            _report(reported, f"horde rejected the request ({reason})")
            return None
    return None


def _report(reported: set, message: str) -> None:
    """Print each distinct failure once. Silent degradation to placeholder
    cards is the worst outcome here — it looks like the pipeline worked."""
    if message not in reported:
        reported.add(message)
        print(f"    ! {message}")


def _horde_known_models(models: list[str]) -> list[str]:
    """Drop names no worker is serving.

    A misspelled model is not a soft failure on the Horde — the job is accepted
    and then never becomes possible, so the whole batch silently degrades to
    placeholder cards. Checking against the live list turns that into a warning.
    """
    if not models:
        return []
    try:
        live = {
            entry["name"]
            for entry in requests.get(
                f"{HORDE}/status/models", params={"type": "image"}, timeout=30
            ).json()
            if entry.get("count", 0) > 0
        }
    except (requests.RequestException, ValueError, KeyError):
        return models

    known = [name for name in models if name in live]
    for name in models:
        if name not in live:
            print(f"    ! horde model not being served, skipping: {name!r}")
    if not known:
        print("    ! no requested horde model is available — using any worker")
    return known


def _horde_round(
    prompts: list[str], seeds: list[int], models: list[str], negative: str
) -> list[bytes | None]:
    headers = _horde_headers()
    reported: set = set()
    jobs: list[str | None] = []
    for index, (prompt, seed) in enumerate(zip(prompts, seeds)):
        if index and index % HORDE_WAVE == 0:
            time.sleep(4)
        jobs.append(_horde_submit(prompt, seed, models, negative, reported))
    accepted = sum(1 for job in jobs if job)
    print(f"    horde: {accepted}/{len(jobs)} accepted, waiting…")

    results: list[bytes | None] = [None] * len(jobs)
    pending = {index for index, job in enumerate(jobs) if job}
    deadline = time.time() + HORDE_DEADLINE

    while pending and time.time() < deadline:
        time.sleep(HORDE_POLL)
        for index in sorted(pending):
            job = jobs[index]
            try:
                check = requests.get(
                    f"{HORDE}/generate/check/{job}", headers=headers, timeout=30
                ).json()
            except (requests.RequestException, ValueError):
                continue
            if check.get("faulted") or (not check.get("is_possible", True)):
                pending.discard(index)
                continue
            if not check.get("done"):
                continue
            try:
                status = requests.get(
                    f"{HORDE}/generate/status/{job}", headers=headers, timeout=60
                ).json()
                generation = status["generations"][0]
                # A censored generation still returns a perfectly valid image —
                # a black card reading "NSFW content detected". It is well over
                # any size threshold, so the flag is the only way to catch it.
                if generation.get("censored"):
                    _report(reported, "horde censored a result (NSFW filter false positive)")
                    pending.discard(index)
                    continue
                image = generation["img"]
                results[index] = (
                    requests.get(image, timeout=60).content
                    if image.startswith("http")
                    else base64.b64decode(image)
                )
            except (requests.RequestException, ValueError, KeyError, IndexError):
                pass
            pending.discard(index)
    return results


def _horde_batch(
    prompts: list[str], seeds: list[int], models: list[str], negative: str
) -> list[bytes | None]:
    """Two rounds. Worker NSFW filters false-positive on dark, empty, unsettling
    scenes often enough that a single pass loses several beats of a horror
    episode; a different seed almost always clears it."""
    models = _horde_known_models(models)
    results = _horde_round(prompts, seeds, models, negative)
    retry = [index for index, data in enumerate(results) if not data]
    if not retry:
        return results

    second = _horde_round(
        [prompts[i] for i in retry], [seeds[i] + 7777 for i in retry], models, negative
    )
    for index, data in zip(retry, second):
        results[index] = data
    return results


PROVIDERS = {
    "pollinations": _pollinations,
    "cloudflare": _cloudflare,
    "gemini": _gemini,
}

# gemini is excluded from the automatic chain: unlike its text models, its image
# models are not reliably free tier, and this pipeline promises a zero-cost run.
AUTO_CHAIN = ["pollinations", "cloudflare", "aihorde"]


def chain() -> list[str]:
    pinned = os.environ.get("BRAINROT_IMAGES")
    if pinned and pinned != "auto":
        return [p for p in pinned.split(",") if p in PROVIDERS or p == "aihorde"]
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
    if "aihorde" in chain():
        ready.append("aihorde (no key needed)")
    return ", ".join(ready) if ready else "none configured — placeholder cards only"


# --------------------------------------------------------------------------

def _cache_path(prompt: str, seed: int, folder: Path) -> Path:
    key = hashlib.sha1(f"{prompt}|{seed}".encode()).hexdigest()[:16]
    return folder / f"cache_{key}.img"


def fetch_many(specs: list[tuple[str, Path, int]], series: dict) -> list[Path]:
    """Produce one still per spec of (image_prompt, destination, seed).

    Batched on purpose: AI Horde is a queue, so submitting every beat at once
    and waiting on them together costs one wait instead of seventeen. Results
    are cached by prompt+seed, so re-runs and the second hook variant are free.
    """
    prompts = [build_prompt(spec[0], series) for spec in specs]
    outstanding: list[int] = []

    for index, (_, dst, seed) in enumerate(specs):
        dst.parent.mkdir(parents=True, exist_ok=True)
        cached = _cache_path(prompts[index], seed, dst.parent)
        if cached.exists() and cached.stat().st_size > 4096:
            dst.write_bytes(cached.read_bytes())
        else:
            outstanding.append(index)

    for provider in chain():
        if not outstanding:
            break
        if provider == "aihorde":
            batch = _horde_batch(
                [prompts[i] for i in outstanding],
                [specs[i][2] for i in outstanding],
                series.get("horde_models", []),
                negative_for(series),
            )
            still_missing = []
            for index, data in zip(outstanding, batch):
                if data and len(data) > 4096:
                    _cache_path(prompts[index], specs[index][2], specs[index][1].parent).write_bytes(data)
                    specs[index][1].write_bytes(data)
                else:
                    still_missing.append(index)
            outstanding = still_missing
            continue

        call = PROVIDERS[provider]
        still_missing = []
        for index in outstanding:
            data = None
            for attempt in range(RETRIES):
                try:
                    data = call(prompts[index], specs[index][2], negative_for(series))
                except requests.RequestException:
                    data = None
                if data and len(data) > 4096:
                    break
                if attempt < RETRIES - 1:
                    time.sleep(3 * (attempt + 1))
            if data and len(data) > 4096:
                _cache_path(prompts[index], specs[index][2], specs[index][1].parent).write_bytes(data)
                specs[index][1].write_bytes(data)
            else:
                still_missing.append(index)
        outstanding = still_missing

    for index in outstanding:
        placeholder(specs[index][1], specs[index][2])

    return [spec[1] for spec in specs]


def fetch(image_prompt: str, series: dict, dst: Path, seed: int) -> Path:
    return fetch_many([(image_prompt, dst, seed)], series)[0]


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
        # Destinations carry a neutral .img extension because providers return
        # webp or png as they please, so the muxer has to be named explicitly.
        "-f", "image2",
        "-c:v", "mjpeg",
        str(dst),
    ])
