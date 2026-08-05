"""Paths, environment and series definitions."""

import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SERIES_DIR = ROOT / "series"
ASSETS_DIR = ROOT / "assets"
FONTS_DIR = ASSETS_DIR / "fonts"
OUT_DIR = Path(os.environ.get("BRAINROT_OUT", ROOT / "out"))
STATE_DIR = Path(os.environ.get("BRAINROT_STATE", ROOT / "state"))

WIDTH = 1080
HEIGHT = 1920
FPS = 30

# Target spoken length. The script writer is told to hit this; the renderer
# just follows the audio, so overruns are cosmetic rather than fatal.
TARGET_SECONDS = (30, 45)

GEMINI_MODEL = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")

# Optional. Only used by --animate hf.
HF_TOKEN = os.environ.get("HF_TOKEN")
HF_VIDEO_MODEL = os.environ.get("HF_VIDEO_MODEL", "Lightricks/LTX-Video")


def load_dotenv() -> None:
    """Read brainrot/.env (and the repo root .env) without adding a dependency."""
    for candidate in (ROOT / ".env", ROOT.parent / ".env", ROOT.parent / ".env.local"):
        if not candidate.exists():
            continue
        for line in candidate.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)

    global GEMINI_API_KEY, HF_TOKEN
    GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    HF_TOKEN = os.environ.get("HF_TOKEN")


def list_series() -> list[str]:
    return sorted(p.stem for p in SERIES_DIR.glob("*.json"))


def load_series(series_id: str) -> dict:
    path = SERIES_DIR / f"{series_id}.json"
    if not path.exists():
        raise SystemExit(
            f"Unknown series '{series_id}'. Available: {', '.join(list_series())}"
        )
    return json.loads(path.read_text(encoding="utf-8"))
