"""Final assembly: stills or clips -> motion -> transitions -> captions -> audio."""

from dataclasses import dataclass
from pathlib import Path

from . import animate, config, ffmpeg


@dataclass
class Beat:
    image: Path
    duration: float
    clip: Path | None = None   # set when a video provider produced real motion


def _frames(seconds: float) -> int:
    return max(2, int(round(seconds * config.FPS)))


def _plan(beats: list[Beat], overlap: float) -> list[int]:
    """Frame count per beat.

    With a cross dissolve each pair overlaps, so every beat but the last is
    rendered `overlap` seconds long to pay for it. Total then lands back on
    sum(duration), which is what the audio and the captions are timed to.
    """
    return [
        _frames(beat.duration + (overlap if index < len(beats) - 1 else 0))
        for index, beat in enumerate(beats)
    ]


def render(
    beats: list[Beat],
    narration: Path,
    subtitles: Path,
    fonts_dir: Path,
    dst: Path,
    seed: int = 0,
    motion: dict | None = None,
    transition: dict | None = None,
) -> Path:
    transition = transition or {}
    dissolve = transition.get("type") == "dissolve" and len(beats) > 1
    overlap = float(transition.get("duration", 0.4)) if dissolve else 0.0

    plan = _plan(beats, overlap)
    inputs: list[str] = []
    filters: list[str] = []

    for index, (beat, frames) in enumerate(zip(beats, plan)):
        if beat.clip:
            inputs += ["-stream_loop", "-1", "-t", f"{frames / config.FPS:.3f}", "-i", str(beat.clip)]
            chain = animate.clip_filter(frames, motion)
        else:
            inputs += ["-i", str(beat.image)]
            chain = animate.motion_filter(index, frames, seed, motion)
        filters.append(f"[{index}:v]{chain}[v{index}]")

    if dissolve:
        # x_k spans beats 0..k, so each new fade starts `overlap` before the
        # running length ends.
        offset = plan[0] / config.FPS - overlap
        current = "[v0]"
        for index in range(1, len(beats)):
            label = "[cat]" if index == len(beats) - 1 else f"[x{index}]"
            filters.append(
                f"{current}[v{index}]xfade=transition=fade"
                f":duration={overlap:.3f}:offset={offset:.3f}{label}"
            )
            offset += plan[index] / config.FPS - overlap
            current = label
    else:
        filters.append(
            "".join(f"[v{index}]" for index in range(len(beats)))
            + f"concat=n={len(beats)}:v=1:a=0[cat]"
        )

    audio_index = len(beats)
    inputs += ["-i", str(narration)]

    subs = str(subtitles).replace("\\", "/").replace(":", r"\:")
    fonts = str(fonts_dir).replace("\\", "/").replace(":", r"\:")
    filters.append(f"[cat]subtitles=filename='{subs}':fontsdir='{fonts}'[vout]")

    # Moving grain is nearly incompressible — at CRF 20 it tripled the bitrate
    # to 12 Mbps and a 97s episode came out at 145MB. Both platforms re-encode
    # on upload well below that, so a grainy series trades a little CRF for a
    # file you can actually post from a phone.
    grainy = bool((motion or {}).get("grain"))
    rate_cap = ["-maxrate", "9M", "-bufsize", "18M"] if grainy else []

    dst.parent.mkdir(parents=True, exist_ok=True)
    ffmpeg.run([
        *inputs,
        "-filter_complex", ";".join(filters),
        "-map", "[vout]",
        "-map", f"{audio_index}:a",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "23" if grainy else "20",
        *rate_cap,
        "-profile:v", "high",
        "-pix_fmt", "yuv420p",
        "-r", str(config.FPS),
        "-c:a", "aac",
        "-b:a", "160k",
        "-ar", "48000",
        "-shortest",
        "-movflags", "+faststart",
        str(dst),
    ])
    return dst
