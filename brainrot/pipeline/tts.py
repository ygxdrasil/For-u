"""Narration via edge-tts.

edge-tts is free, needs no key, and — critically — streams WordBoundary events
alongside the audio. Those give exact per-word timings, which is what makes
karaoke captions possible without running a speech recogniser.
"""

import asyncio
import os
import ssl
from dataclasses import dataclass
from pathlib import Path

import aiohttp
import edge_tts

from . import ffmpeg

LINE_GAP = 0.12       # pause between beats
HOOK_GAP = 0.30       # slightly longer beat after the hook lands
TAIL = 0.35           # trailing silence so the last word is not clipped
RETRIES = 3


def _proxy() -> str | None:
    return os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")


def _connector() -> aiohttp.BaseConnector | None:
    """edge-tts pins certifi's CA bundle, which fails behind a TLS-inspecting
    proxy. Honour the usual CA environment variables when they are present."""
    for key in ("SSL_CERT_FILE", "REQUESTS_CA_BUNDLE", "CURL_CA_BUNDLE"):
        bundle = os.environ.get(key)
        if bundle and Path(bundle).exists():
            return aiohttp.TCPConnector(ssl=ssl.create_default_context(cafile=bundle))
    return None


@dataclass
class Word:
    text: str
    start: float
    end: float


@dataclass
class Line:
    speaker: str
    text: str
    image_prompt: str
    start: float = 0.0
    end: float = 0.0


async def _synthesize(text: str, spec: dict, dst: Path) -> list[Word]:
    last_error: Exception | None = None
    for attempt in range(RETRIES):
        words: list[Word] = []
        audio = bytearray()
        try:
            communicate = edge_tts.Communicate(
                text,
                spec["voice"],
                rate=spec.get("rate", "+0%"),
                pitch=spec.get("pitch", "+0Hz"),
                boundary="WordBoundary",
                connector=_connector(),
                proxy=_proxy(),
            )
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio.extend(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    start = chunk["offset"] / 1e7
                    words.append(Word(chunk["text"], start, start + chunk["duration"] / 1e7))
            if not audio:
                raise RuntimeError("edge-tts returned no audio")
            dst.write_bytes(bytes(audio))
            return words
        except Exception as exc:  # network flakiness is the common case
            last_error = exc
            await asyncio.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"edge-tts failed after {RETRIES} attempts: {last_error}")


async def _narrate(lines: list[Line], speakers: dict, workdir: Path):
    parts: list[Path] = []
    words: list[Word] = []
    cursor = 0.0

    for index, line in enumerate(lines):
        spec = speakers.get(line.speaker) or next(iter(speakers.values()))
        mp3 = workdir / f"line{index:02d}.mp3"
        wav = workdir / f"line{index:02d}.wav"

        line_words = await _synthesize(line.text, spec, mp3)
        duration = ffmpeg.to_wav(mp3, wav)

        line.start = cursor
        line.end = cursor + duration
        words += [Word(w.text, cursor + w.start, cursor + min(w.end, duration)) for w in line_words]
        parts.append(wav)
        cursor += duration

        if index < len(lines) - 1:
            gap = HOOK_GAP if index == 0 else LINE_GAP
            pad = workdir / f"gap{index:02d}.wav"
            ffmpeg.silence(pad, gap)
            parts.append(pad)
            cursor += gap
            line.end = cursor  # the beat's image holds through the pause

    tail = workdir / "tail.wav"
    ffmpeg.silence(tail, TAIL)
    parts.append(tail)
    lines[-1].end = cursor + TAIL

    narration = workdir / "narration.wav"
    total = ffmpeg.concat_audio(parts, narration)
    return narration, total, words


def narrate(lines: list[Line], speakers: dict, workdir: Path):
    """Render every line, returning (wav path, total seconds, absolute word timings)."""
    workdir.mkdir(parents=True, exist_ok=True)
    return asyncio.run(_narrate(lines, speakers, workdir))


def list_voices(prefix: str = "en-US") -> list[str]:
    async def _run():
        voices = await edge_tts.list_voices(connector=_connector(), proxy=_proxy())
        return [v["ShortName"] for v in voices]

    return sorted(v for v in asyncio.run(_run()) if v.startswith(prefix))
