"""Turning stills into motion.

Ken Burns alone reads as a slideshow. On top of the push/pull, each beat can
carry a handheld camera, a moving film grain, a light flicker and a breathing
vignette — all evaluated per frame in ffmpeg, so it costs nothing and needs no
video model. Series switch it on through a "motion" block; a series without
one renders exactly as before.

The `hf` provider remains for real image-to-video on Hugging Face's free tier.
It is best effort: free video tiers are heavily rate limited and frequently
cold, so every failure falls back to the procedural motion above.
"""

import time
from pathlib import Path

import requests

from . import config

# zoompan works on the pre-scaled frame, and oversampling is what keeps its
# integer stepping from looking like jitter. 1.5x is enough: at the 1.20
# maximum zoom the crop is 1350x2400, so the result is always downsampled to
# 1080x1920 and never upscaled. Measured against 2x on a 17-beat episode it
# renders in 117s against 132s — a modest saving, and no quality cost.
OVERSAMPLE = 1.5

NO_MOTION = {"shake": 0, "grain": 0, "flicker": 0.0, "vignette_pulse": 0.0}

# (zoom expression, x expression, y expression)
MOTIONS = [
    ("min(1.0+0.0015*on,1.20)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),           # push in
    ("max(1.20-0.0015*on,1.0)", "iw/2-(iw/zoom/2)", "ih/2-(ih/zoom/2)"),           # pull out
    ("min(1.0+0.0011*on,1.14)", "(iw-iw/zoom)*(on/{frames})", "ih/2-(ih/zoom/2)"), # drift right
    ("min(1.0+0.0011*on,1.14)", "(iw-iw/zoom)*(1-on/{frames})", "(ih-ih/zoom)*0.3"),  # drift left
]

# Two incommensurate sines per axis: no visible loop, no repeat between beats
# once the seed shifts the phase. Peak excursion is 1.6x the shake amplitude.
SHAKE_FREQS = ((0.31, 0.83), (0.27, 0.61))


def _even(value: float) -> int:
    return int(value) // 2 * 2


def _canvas(shake: int) -> tuple[int, int, int]:
    """Padded zoompan canvas that leaves room to crop the shake back out."""
    if shake <= 0:
        return config.WIDTH, config.HEIGHT, 0
    margin = int(shake * 1.7) + 2
    width = _even(config.WIDTH + 2 * margin)
    height = _even(round(width * config.HEIGHT / config.WIDTH))
    return width, height, margin


def _shake_expr(axis: int, amplitude: int, phase: float) -> str:
    slow, fast = SHAKE_FREQS[axis]
    centre = "(iw-ow)/2" if axis == 0 else "(ih-oh)/2"
    return (
        f"{centre}+{amplitude}*sin(2*PI*t*{slow}+{phase:.2f})"
        f"+{amplitude * 0.6:.1f}*sin(2*PI*t*{fast}+{phase * 1.7:.2f})"
    )


def motion_filter(index: int, frames: int, seed: int, motion: dict | None = None) -> str:
    """Build the per-beat video chain: exactly `frames` frames at 1080x1920."""
    settings = {**NO_MOTION, **(motion or {})}
    shake = int(settings["shake"])
    canvas_w, canvas_h, _ = _canvas(shake)

    zoom, x, y = MOTIONS[(index + seed) % len(MOTIONS)]
    chain = [
        f"scale={_even(canvas_w * OVERSAMPLE)}:{_even(canvas_h * OVERSAMPLE)}"
        f":force_original_aspect_ratio=increase",
        f"crop={_even(canvas_w * OVERSAMPLE)}:{_even(canvas_h * OVERSAMPLE)}",
        f"zoompan=z='{zoom}':x='{x.format(frames=frames)}':y='{y.format(frames=frames)}'"
        f":d={frames}:s={canvas_w}x{canvas_h}:fps={config.FPS}",
    ]

    if shake:
        phase = (index + seed) % 7
        chain.append(
            f"crop={config.WIDTH}:{config.HEIGHT}"
            f":x='{_shake_expr(0, shake, phase)}':y='{_shake_expr(1, shake, phase + 1.1)}'"
        )

    flicker = float(settings["flicker"])
    if flicker:
        chain.append(
            f"eq=brightness='{flicker:.4f}*sin(2*PI*t*0.7)"
            f"+{flicker * 0.6:.4f}*sin(2*PI*t*3.1)':eval=frame"
        )

    pulse = float(settings["vignette_pulse"])
    if pulse:
        chain.append(f"vignette=angle='PI/5+{pulse:.3f}*sin(2*PI*t/5)':eval=frame")

    grain = int(settings["grain"])
    if grain:
        # allf=t regenerates the pattern every frame, so the grain moves.
        chain.append(f"noise=alls={grain}:allf=t+u")

    # xfade refuses a stream whose frame rate is undefined, which is what a
    # still image input leaves behind — so pin it explicitly, always.
    chain += [f"trim=end_frame={frames}", "setpts=PTS-STARTPTS", f"fps={config.FPS}",
              "setsar=1", "format=yuv420p"]
    return ",".join(chain)


def clip_filter(frames: int, motion: dict | None = None) -> str:
    """Same treatment for a real video clip: fit to frame, then the grade."""
    settings = {**NO_MOTION, **(motion or {})}
    chain = [
        f"scale={config.WIDTH}:{config.HEIGHT}:force_original_aspect_ratio=increase",
        f"crop={config.WIDTH}:{config.HEIGHT}",
    ]
    if settings["grain"]:
        chain.append(f"noise=alls={int(settings['grain'])}:allf=t+u")
    chain += [f"trim=end_frame={frames}", "setpts=PTS-STARTPTS", f"fps={config.FPS}",
              "setsar=1", "format=yuv420p"]
    return ",".join(chain)


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
