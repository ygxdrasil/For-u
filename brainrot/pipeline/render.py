"""Final assembly: stills or clips -> motion -> hard cuts -> burned captions -> audio."""

from dataclasses import dataclass
from pathlib import Path

from . import animate, config, ffmpeg


@dataclass
class Beat:
    image: Path
    duration: float
    clip: Path | None = None   # set when a video provider produced real motion


def render(
    beats: list[Beat],
    narration: Path,
    subtitles: Path,
    fonts_dir: Path,
    dst: Path,
    seed: int = 0,
) -> Path:
    inputs: list[str] = []
    filters: list[str] = []
    labels: list[str] = []

    for index, beat in enumerate(beats):
        frames = max(2, int(round(beat.duration * config.FPS)))
        if beat.clip:
            inputs += ["-stream_loop", "-1", "-t", f"{beat.duration:.3f}", "-i", str(beat.clip)]
            chain = (
                f"scale={config.WIDTH}:{config.HEIGHT}:force_original_aspect_ratio=increase,"
                f"crop={config.WIDTH}:{config.HEIGHT},fps={config.FPS},setsar=1,format=yuv420p"
            )
        else:
            inputs += ["-i", str(beat.image)]
            chain = animate.kenburns_filter(index, frames, seed)
        filters.append(f"[{index}:v]{chain},trim=end_frame={frames},setpts=PTS-STARTPTS[v{index}]")
        labels.append(f"[v{index}]")

    audio_index = len(beats)
    inputs += ["-i", str(narration)]

    subs = str(subtitles).replace("\\", "/").replace(":", r"\:")
    fonts = str(fonts_dir).replace("\\", "/").replace(":", r"\:")
    filters.append(
        "".join(labels)
        + f"concat=n={len(beats)}:v=1:a=0[cat];"
        + f"[cat]subtitles=filename='{subs}':fontsdir='{fonts}'[vout]"
    )

    dst.parent.mkdir(parents=True, exist_ok=True)
    ffmpeg.run([
        *inputs,
        "-filter_complex", ";".join(filters),
        "-map", "[vout]",
        "-map", f"{audio_index}:a",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
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
