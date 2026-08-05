"""Locating and driving ffmpeg.

Resolution order: $FFMPEG_BIN, then a system ffmpeg, then the static binary
that ships inside imageio-ffmpeg. The bundled one is built with libass,
libfreetype and libx264, which is everything the renderer needs, so the
pipeline runs on a machine with no system ffmpeg at all.
"""

import os
import shutil
import subprocess
import wave
from functools import lru_cache
from pathlib import Path


class FFmpegError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def ffmpeg_bin() -> str:
    override = os.environ.get("FFMPEG_BIN")
    if override:
        return override
    system = shutil.which("ffmpeg")
    if system:
        return system
    try:
        import imageio_ffmpeg
    except ImportError as exc:  # pragma: no cover - install guard
        raise FFmpegError(
            "No ffmpeg found. Install one, or `pip install imageio-ffmpeg`."
        ) from exc
    return imageio_ffmpeg.get_ffmpeg_exe()


def run(args: list[str], quiet: bool = True) -> None:
    cmd = [ffmpeg_bin(), "-hide_banner", "-nostdin", "-y", *args]
    proc = subprocess.run(
        cmd,
        stdout=subprocess.DEVNULL if quiet else None,
        stderr=subprocess.PIPE,
        text=True,
    )
    if proc.returncode != 0:
        tail = "\n".join((proc.stderr or "").strip().splitlines()[-25:])
        raise FFmpegError(f"ffmpeg failed ({proc.returncode}):\n{tail}")


def to_wav(src: Path, dst: Path, sample_rate: int = 48000) -> float:
    """Decode any audio file to mono PCM wav and return its exact duration."""
    run(["-i", str(src), "-ar", str(sample_rate), "-ac", "1", "-c:a", "pcm_s16le", str(dst)])
    return wav_duration(dst)


def wav_duration(path: Path) -> float:
    with wave.open(str(path), "rb") as handle:
        return handle.getnframes() / float(handle.getframerate())


def silence(dst: Path, seconds: float, sample_rate: int = 48000) -> None:
    run([
        "-f", "lavfi",
        "-i", f"anullsrc=r={sample_rate}:cl=mono",
        "-t", f"{seconds:.3f}",
        "-c:a", "pcm_s16le",
        str(dst),
    ])


def concat_audio(parts: list[Path], dst: Path) -> float:
    """Concatenate same-format wav files via the concat demuxer."""
    listing = dst.with_suffix(".txt")
    listing.write_text(
        "".join(f"file '{p.resolve().as_posix()}'\n" for p in parts), encoding="utf-8"
    )
    run(["-f", "concat", "-safe", "0", "-i", str(listing), "-c", "copy", str(dst)])
    listing.unlink(missing_ok=True)
    return wav_duration(dst)
