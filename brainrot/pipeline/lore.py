"""The lore bible: what the channel has already established, so scripts stay
consistent across episodes and never repeat a topic.

One JSON file per series in state/<series>/lore.json. It is fed into every
script prompt and updated after every accepted script.
"""

import json
from pathlib import Path

from . import config

MAX_CANON = 120
MAX_HISTORY = 60


def _path(series_id: str) -> Path:
    return config.STATE_DIR / series_id / "lore.json"


def load(series_id: str) -> dict:
    path = _path(series_id)
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {"series": series_id, "episode_count": 0, "canon": [], "episodes": []}


def save(book: dict) -> None:
    path = _path(book["series"])
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(book, indent=2, ensure_ascii=False), encoding="utf-8")


def next_episode_number(book: dict) -> int:
    return book.get("episode_count", 0) + 1


def record(book: dict, script: dict) -> None:
    """Fold an accepted script back into the bible."""
    book["episode_count"] = book.get("episode_count", 0) + 1
    book.setdefault("episodes", []).append(
        {
            "n": book["episode_count"],
            "label": script.get("episode_label", ""),
            "title": script.get("title", ""),
            "premise": script.get("logline", ""),
        }
    )
    book["episodes"] = book["episodes"][-MAX_HISTORY:]

    canon = book.setdefault("canon", [])
    for fact in script.get("canon_additions", []):
        fact = fact.strip()
        if fact and fact not in canon:
            canon.append(fact)
    book["canon"] = canon[-MAX_CANON:]


def brief(book: dict) -> str:
    """The slice of the bible that goes into the prompt."""
    episodes = book.get("episodes", [])[-25:]
    lines = []
    if book.get("canon"):
        lines.append("ESTABLISHED CANON (must stay consistent with all of this):")
        lines += [f"- {fact}" for fact in book["canon"][-40:]]
    if episodes:
        lines.append("")
        lines.append("ALREADY PUBLISHED (do not repeat these premises):")
        lines += [
            f"- {ep.get('label') or ep['n']}: {ep.get('title', '')} — {ep.get('premise', '')}"
            for ep in episodes
        ]
    return "\n".join(lines) if lines else "Nothing published yet. This is episode one."
