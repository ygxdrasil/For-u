"""Turning stills into motion.

Two providers:

  kenburns  (default) — ffmpeg zoompan over an upscaled still. Free, instant,
            unlimited, and honestly what most of this genre already uses.
  hf        — best effort image-to-video through Hugging Face's free inference
            tier. Free tiers for video models are heavily rate limited and
            frequently cold, so every failure silently falls back to kenburns.
"""

import time
from pathlib import Path

import requests

from . import config

# (zoom expression, x expression, y expression)
MOTIONS = [
    ("min(1.0+0.0015*on,1.20)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),           # push in
    ("max(1.20-0.0015*on,1.0)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),           # pull out
    ("min(1.0+0.0011*on,1.14)", "(iw-iw/zoom)*(on/{frames})", "ih/2-(ih/zoom/2)"), # drift right
    ("min(1.0+0.0011*on,1.14)", "(iw-iw/zoom)*(1-on/{frames})", "(ih-ih/zoom)*0.3"),  # drift left
]


def kenburns_filter(index: int, frames: int, seed: int) -> str:
    zoom, x, y = MOTIONS[(index + seed) % len(MOTIONS)]
    return (
        f"scale=2160:3840:force_original_aspect_ratio=increase,crop=2160:3840,"
        f"zoompan=z='{zoom}':x='{x.format(frames=frames)}':y='{y.format(frames=frames)}'"
        f":d={frames}:s={config.WIDTH}x{config.HEIGHT}:fps={config.FPS},"
        f"setsar=1,format=yuv420p"
    )


def try_hf_clip(image: Path, prompt: str, dst: Path) -> Path | None:
    """Return an animated clip, or None if the free tier will not play ball."""
    if not config.HF_TOKEN:
        return None

    url = f"https://api-inference.huggingface.co/models/{config.HF_VIDEO_MODEL}"
    headers = {"Authorization": f"Bearer {config.HF_TOKEN}", "Accept": "video/mp4"}

    for attempt in range(2):
        try:
            response = requests.post(
                url,
                headers=headers,
                data=image.read_bytes(),
                params={"prompt": prompt[:300]},
                timeout=300,
            )
        except requests.RequestException:
            return None

        if response.status_code == 200 and len(response.content) > 20_000:
            dst.write_bytes(response.content)
            return dst
        if response.status_code == 503 and attempt == 0:
            time.sleep(20)  # model is loading
            continue
        return None
    return None
