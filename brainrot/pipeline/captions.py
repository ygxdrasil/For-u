"""Karaoke word-pop captions as an ASS subtitle file.

Up to three words sit on screen at once. The word currently being spoken is
highlighted, and each new group snaps in with a scale pop. Timings come
straight from the TTS word boundaries, so the highlight lands on the syllable.
"""

from pathlib import Path

from . import config

MAX_WORDS = 3
MAX_CHARS = 24
SPLIT_PAUSE = 0.30       # a gap this long starts a new group
MIN_EVENT = 0.10
POP_MS = 110

HEADER = """[Script Info]
ScriptType: v4.00+
PlayResX: {width}
PlayResY: {height}
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Pop,{font},{size},{primary},{primary},{outline},&H90000000,{bold},0,0,0,100,100,0,0,1,{outline_width},3,5,60,60,60,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def _timestamp(seconds: float) -> str:
    seconds = max(0.0, seconds)
    hours, rest = divmod(seconds, 3600)
    minutes, secs = divmod(rest, 60)
    return f"{int(hours)}:{int(minutes):02d}:{secs:05.2f}"


def _inline(colour: str) -> str:
    """&HAABBGGRR (style form) -> &HBBGGRR& (inline form)."""
    digits = colour.replace("&H", "").replace("&", "")
    if len(digits) == 8:
        digits = digits[2:]
    return f"&H{digits}&"


def _escape(text: str) -> str:
    return text.replace("\\", "\\\\").replace("{", "(").replace("}", ")")


def group_words(words) -> list[list]:
    groups: list[list] = []
    current: list = []
    for index, word in enumerate(words):
        if current:
            previous = current[-1]
            too_long = len(current) >= MAX_WORDS
            too_wide = sum(len(w.text) + 1 for w in current) + len(word.text) > MAX_CHARS
            paused = word.start - previous.end > SPLIT_PAUSE
            ended = previous.text.strip().endswith((".", "!", "?", ":", "—"))
            if too_long or too_wide or paused or ended:
                groups.append(current)
                current = []
        current.append(word)
        if index == len(words) - 1:
            groups.append(current)
    return [g for g in groups if g]


def write(
    words, style: dict, font_family: str, dst: Path, total: float, bold: bool = False
) -> Path:
    highlight = _inline(style["highlight"])
    primary = _inline(style["primary"])
    x = config.WIDTH // 2
    y = int(config.HEIGHT * style.get("y_ratio", 0.65))

    lines = [
        HEADER.format(
            width=config.WIDTH,
            height=config.HEIGHT,
            font=font_family,
            size=style["size"],
            primary=style["primary"],
            outline=style["outline"],
            outline_width=style["outline_width"],
            bold=-1 if bold else 0,
        )
    ]

    groups = group_words(words)
    for group_index, group in enumerate(groups):
        next_group_start = (
            groups[group_index + 1][0].start if group_index + 1 < len(groups) else total
        )
        for word_index, word in enumerate(group):
            start = word.start
            if word_index + 1 < len(group):
                end = group[word_index + 1].start
            else:
                # Hold the last word of a group until the next group starts, so
                # short pauses between lines do not blank the screen. Cap it so
                # a long pause does not leave a stale caption sitting there.
                end = min(next_group_start, word.end + 0.8)
            if end - start < MIN_EVENT:
                end = start + MIN_EVENT

            rendered = []
            for other_index, other in enumerate(group):
                text = _escape(other.text.strip().upper())
                if other_index == word_index:
                    rendered.append(f"{{\\c{highlight}}}{text}{{\\c{primary}}}")
                else:
                    rendered.append(text)
            body = " ".join(rendered)

            intro = (
                f"\\fscx82\\fscy82\\t(0,{POP_MS},\\fscx100\\fscy100)\\fad(50,0)"
                if word_index == 0
                else ""
            )
            lines.append(
                f"Dialogue: 0,{_timestamp(start)},{_timestamp(end)},Pop,,0,0,0,,"
                f"{{\\an5\\pos({x},{y}){intro}}}{body}"
            )

    dst.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return dst
