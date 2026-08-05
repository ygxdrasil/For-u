"""Script generation.

Primary path: Gemini's free tier over plain REST (no SDK dependency), asked
for strict JSON via responseSchema. Fallback path: a small offline generator
so the pipeline is runnable and testable with no API key at all.
"""

import json
import random
import textwrap

import requests

from . import config, lore

ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

SCRIPT_SCHEMA = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "logline": {"type": "string"},
        "hooks": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "variant": {"type": "string"},
                    "speaker": {"type": "string"},
                    "text": {"type": "string"},
                    "image_prompt": {"type": "string"},
                },
                "required": ["variant", "speaker", "text", "image_prompt"],
            },
        },
        "beats": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "speaker": {"type": "string"},
                    "text": {"type": "string"},
                    "image_prompt": {"type": "string"},
                },
                "required": ["speaker", "text", "image_prompt"],
            },
        },
        "canon_additions": {"type": "array", "items": {"type": "string"}},
        "metadata": {
            "type": "object",
            "properties": {
                "youtube_title": {"type": "string"},
                "youtube_description": {"type": "string"},
                "tiktok_caption": {"type": "string"},
                "hashtags": {"type": "array", "items": {"type": "string"}},
            },
            "required": ["youtube_title", "youtube_description", "tiktok_caption", "hashtags"],
        },
    },
    "required": ["title", "logline", "hooks", "beats", "canon_additions", "metadata"],
}


def build_prompt(series: dict, book: dict, episode_no: int, topic_hint: str | None) -> str:
    speakers = ", ".join(
        f"{name} ({spec['voice']})" for name, spec in series["speakers"].items()
    )
    guidelines = "\n".join(f"- {g}" for g in series["script_guidelines"])
    label = series["episode_label_format"].format(n=episode_no)
    lo, hi = config.TARGET_SECONDS
    hint = f"\nTOPIC THE USER ASKED FOR: {topic_hint}\n" if topic_hint else ""

    return textwrap.dedent(
        f"""
        You write vertical short-form video scripts for a serialised channel.
        They are fast, funny and specific. They are NOT generic AI filler —
        every episode belongs to one universe with continuing characters.

        SERIES: {series['name']}
        PREMISE: {series['premise']}
        THIS EPISODE'S LABEL: {label}
        SPEAKERS AVAILABLE: {speakers}
        DELIVERY: {series['voice_note']}

        WRITING RULES:
        {guidelines}

        {lore.brief(book)}
        {hint}
        HARD REQUIREMENTS:
        - Spoken length {lo}-{hi} seconds. That is roughly {int(lo * 2.6)}-{int(hi * 2.6)} words TOTAL across every beat. Count them.
        - Write 6 to 9 beats. One beat is one line of speech and gets one image.
        - Write EXACTLY 2 hooks, variant "A" and variant "B". Each is a single
          spoken line under 12 words that replaces the opening. They must use
          genuinely different tactics (e.g. a blunt claim vs. a direct question).
          The beats must read naturally after either one.
        - "speaker" on every hook and beat must be one of: {', '.join(series['speakers'])}.
        - image_prompt is a standalone description of ONE still image. No text,
          no words, no letters in the image. Do not reference other beats.
          Describe the subject concretely — a model with no memory reads it alone.
        - Never write stage directions, emoji or narration markers in "text".
          "text" is read aloud verbatim by a text-to-speech voice.
        - Spell out numbers and abbreviations the way they should be spoken.
        - canon_additions: 1-3 short facts this episode establishes for future
          episodes. Concrete and reusable, not a plot summary.
        - metadata.youtube_title under 70 characters, no clickbait punctuation spam.
        - metadata.hashtags: 5-7 tags, lowercase, including {' '.join(series['hashtags'][:3])}.

        Return JSON only.
        """
    ).strip()


def generate_script(
    series: dict, book: dict, episode_no: int, topic_hint: str | None = None
) -> dict:
    if not config.GEMINI_API_KEY:
        return offline_script(series, book, episode_no, topic_hint)

    payload = {
        "contents": [{"role": "user", "parts": [{"text": build_prompt(series, book, episode_no, topic_hint)}]}],
        "generationConfig": {
            "temperature": 1.15,
            "topP": 0.95,
            "responseMimeType": "application/json",
            "responseSchema": SCRIPT_SCHEMA,
        },
    }
    response = requests.post(
        ENDPOINT.format(model=config.GEMINI_MODEL),
        params={"key": config.GEMINI_API_KEY},
        json=payload,
        timeout=180,
    )
    if response.status_code != 200:
        raise RuntimeError(
            f"Gemini returned {response.status_code}: {response.text[:400]}"
        )
    body = response.json()
    try:
        text = body["candidates"][0]["content"]["parts"][0]["text"]
    except (KeyError, IndexError) as exc:
        raise RuntimeError(f"Unexpected Gemini response: {json.dumps(body)[:400]}") from exc

    script = json.loads(text)
    script["episode_label"] = series["episode_label_format"].format(n=episode_no)
    return normalise(series, script)


def normalise(series: dict, script: dict) -> dict:
    """Repair the things a model gets wrong often enough to be worth handling."""
    valid = set(series["speakers"])
    default = series["default_speaker"]

    for item in list(script.get("hooks", [])) + list(script.get("beats", [])):
        if item.get("speaker") not in valid:
            item["speaker"] = default
        item["text"] = " ".join(str(item.get("text", "")).split())
        item["image_prompt"] = str(item.get("image_prompt", "")).strip() or script.get("title", "")

    script["hooks"] = [h for h in script.get("hooks", []) if h["text"]][:2]
    script["beats"] = [b for b in script.get("beats", []) if b["text"]]
    if not script["hooks"]:
        raise ValueError("script has no usable hook")
    if not script["beats"]:
        raise ValueError("script has no usable beats")
    for index, hook in enumerate(script["hooks"]):
        hook["variant"] = hook.get("variant") or chr(ord("A") + index)
    return script


# --------------------------------------------------------------------------
# Offline fallback
# --------------------------------------------------------------------------

_SEEDS = {
    "unreal_registry": [
        ("The Tuesday Staircase", "a concrete stairwell that only exists on Tuesdays", [
            "A stairwell in a parking garage in Ohio only exists on Tuesdays.",
            "Every other day of the week, that wall is solid poured concrete.",
            "We have measured it. We have drilled it. It is a wall.",
            "On Tuesday at six in the morning, there are forty one steps down.",
            "Nobody has ever counted forty one steps on the way back up.",
            "The people who come back up are fine. They are simply not in a hurry anymore.",
            "If it is Tuesday where you are, do not go looking for a basement you have never used.",
        ]),
        ("The Politest Sound", "a recorded tone that apologises", [
            "In nineteen ninety four we recorded a tone under a frozen lake.",
            "It is four seconds long and it repeats every eleven minutes.",
            "Three separate linguists transcribed it independently.",
            "All three wrote down the same word. The word was sorry.",
            "We do not know what the lake is apologising for.",
            "We know it started apologising two days before anything happened.",
            "The rest of that sentence is classified.",
        ]),
    ],
    "wrong_history": [
        ("The Ten Days That Never Happened", "the 1582 calendar switch", [
            "In October fifteen eighty two, ten days simply did not happen.",
            "Europe went to sleep on the fourth and woke up on the fifteenth.",
            "That part is completely true. Look it up right now.",
            "What nobody mentions is that people were still scheduled to work those days.",
            "The wages for ten unworked days were never returned. They were banked.",
            "That account has been collecting interest for four hundred and forty years.",
            "Somebody is very rich and it is legally nobody. Go on, prove me wrong.",
        ]),
        ("The Emperor Who Outlawed Mondays", "an invented Roman decree", [
            "Rome ran on an eight day week before Julius Caesar rewrote the calendar.",
            "True. Market day was every eighth day and the whole city stopped.",
            "When the seven day week arrived, one day had no job at all.",
            "The Senate called it the spare day and refused to name it.",
            "For eleven years, Romans were legally not required to acknowledge it.",
            "We eventually named it Monday, and honestly, we should not have.",
            "Look up the spare day. You will find nothing. That is the point.",
        ]),
    ],
    "doomer_hypeman": [
        ("Self Checkout", "self checkout machines", [
            ("DOOMER", "They replaced the cashier with a machine that yells at you."),
            ("HYPEMAN", "Free job! You are in retail now, king!"),
            ("DOOMER", "I am doing unpaid labour and it accused me of theft."),
            ("HYPEMAN", "Unpaid experience. That is a resume line."),
            ("DOOMER", "It said unexpected item in the bagging area. It was my hand."),
            ("HYPEMAN", "It noticed you! Nobody has noticed you in years!"),
            ("DOOMER", "This is how it starts."),
            ("HYPEMAN", "This is how you win! Scan a banana, change your life!"),
        ]),
        ("Airport Water", "buying water after security", [
            ("DOOMER", "Nine dollars. For water. Past security."),
            ("HYPEMAN", "Premium hydration at altitude! You are basically an athlete!"),
            ("DOOMER", "They took my water and then sold me water."),
            ("HYPEMAN", "Circular economy! You are in the loop now!"),
            ("DOOMER", "Civilisation ends in a terminal with a nine dollar bottle."),
            ("HYPEMAN", "Civilisation ends and you are hydrated! Who wins? You!"),
        ]),
    ],
}

_HOOKS = {
    "unreal_registry": [
        "This case file was declassified by mistake.",
        "We were told not to number this one.",
    ],
    "wrong_history": [
        "History lied to you and I can prove it.",
        "Why does nobody talk about this?",
    ],
    "doomer_hypeman": [
        "It is over.",
        "It has never been more on.",
    ],
}


def offline_script(
    series: dict, book: dict, episode_no: int, topic_hint: str | None = None
) -> dict:
    """Deterministic-ish local generator used when no GEMINI_API_KEY is set."""
    seeds = _SEEDS[series["id"]]
    title, logline, lines = seeds[(episode_no - 1) % len(seeds)]
    default = series["default_speaker"]
    rng = random.Random(f"{series['id']}-{episode_no}")

    beats = []
    for line in lines:
        speaker, text = line if isinstance(line, tuple) else (default, line)
        beats.append(
            {
                "speaker": speaker,
                "text": text,
                "image_prompt": f"{text} — {logline}",
            }
        )

    hook_speaker = beats[0]["speaker"]
    hooks = [
        {
            "variant": variant,
            "speaker": hook_speaker,
            "text": text,
            "image_prompt": f"{logline}, dramatic opening shot, {rng.choice(['wide angle', 'extreme close up'])}",
        }
        for variant, text in zip("AB", _HOOKS[series["id"]])
    ]

    script = {
        "title": title,
        "logline": logline,
        "episode_label": series["episode_label_format"].format(n=episode_no),
        "hooks": hooks,
        "beats": beats,
        "canon_additions": [logline],
        "metadata": {
            "youtube_title": f"{series['episode_label_format'].format(n=episode_no)}: {title}",
            "youtube_description": f"{logline}. {series['name']}, episode {episode_no}.",
            "tiktok_caption": f"{title} 👀",
            "hashtags": series["hashtags"],
        },
        "offline": True,
    }
    return normalise(series, script)
