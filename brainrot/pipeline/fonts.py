"""Caption font handling.

Anton is the heavy condensed display face that short-form captions live on.
It is OFL licensed, so we fetch it once into assets/fonts and hand libass that
directory. With no network we fall back to a bold face that ships with the OS.
"""

from pathlib import Path

import requests

from . import config

ANTON_URLS = [
    "https://raw.githubusercontent.com/google/fonts/main/ofl/anton/Anton-Regular.ttf",
    "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/anton/Anton-Regular.ttf",
]
# Not the Google Fonts CSS API: it serves EOT/WOFF2 depending on user agent,
# and libass reads neither.
FALLBACKS = [
    ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "DejaVu Sans"),
    ("/usr/share/fonts/truetype/freefont/FreeSansBold.ttf", "FreeSans"),
    ("/System/Library/Fonts/Supplemental/Impact.ttf", "Impact"),
    ("C:/Windows/Fonts/impact.ttf", "Impact"),
]
TTF_MAGIC = (b"\x00\x01\x00\x00", b"true", b"OTTO")


def ensure(preferred: str = "Anton") -> tuple[str, Path, bool]:
    """Return (family name for ASS, directory to hand libass, needs_synthetic_bold)."""
    config.FONTS_DIR.mkdir(parents=True, exist_ok=True)
    anton = config.FONTS_DIR / "Anton-Regular.ttf"

    if preferred == "Anton" and not anton.exists():
        for url in ANTON_URLS:
            try:
                response = requests.get(url, timeout=60)
            except requests.RequestException:
                continue
            if (
                response.status_code == 200
                and len(response.content) > 20_000
                and response.content[:4] in TTF_MAGIC
            ):
                anton.write_bytes(response.content)
                break

    if anton.exists():
        # Anton is already a heavy display face; faux-bolding it smears it.
        return "Anton", config.FONTS_DIR, False

    for path, family in FALLBACKS:
        if Path(path).exists():
            return family, Path(path).parent, True

    return "sans-serif", config.FONTS_DIR, True
