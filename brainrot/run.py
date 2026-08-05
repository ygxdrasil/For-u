#!/usr/bin/env python3
"""Brainrot video pipeline.

    python run.py                        # 5 videos, round-robin across all series
    python run.py --series wrong_history --count 3
    python run.py --topic "elevators" --yes
    python run.py --list-voices
"""

import argparse
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from pipeline import config, pipeline, tts  # noqa: E402


def main() -> int:
    config.load_dotenv()

    parser = argparse.ArgumentParser(description="Generate short-form videos.")
    parser.add_argument(
        "--series",
        default="all",
        help=f"one of {', '.join(config.list_series())}, or 'all' to round-robin",
    )
    parser.add_argument("--count", type=int, default=5, help="videos to produce (default 5)")
    parser.add_argument("--topic", help="steer this batch toward a subject")
    parser.add_argument("--yes", action="store_true", help="skip the review gate")
    parser.add_argument("--no-ab", action="store_true", help="render one hook instead of two")
    parser.add_argument(
        "--animate",
        choices=["kenburns", "hf"],
        default="kenburns",
        help="motion provider; 'hf' tries a free image-to-video tier and falls back",
    )
    parser.add_argument(
        "--images",
        choices=["auto", "pollinations", "cloudflare", "gemini"],
        help="pin an image provider (default: auto, see pipeline/images.py)",
    )
    parser.add_argument("--scripts-only", action="store_true", help="write scripts, skip rendering")
    parser.add_argument("--out", type=Path, help="output directory (default brainrot/out)")
    parser.add_argument("--list-voices", action="store_true", help="print available TTS voices")
    args = parser.parse_args()

    if args.images:
        os.environ["BRAINROT_IMAGES"] = args.images

    if args.list_voices:
        for voice in tts.list_voices():
            print(voice)
        return 0

    series_ids = config.list_series() if args.series == "all" else [args.series]
    for series_id in series_ids:
        config.load_series(series_id)

    produced = pipeline.run(
        series_ids,
        count=max(1, args.count),
        topic=args.topic,
        auto=args.yes,
        ab=not args.no_ab,
        animate_mode=args.animate,
        scripts_only=args.scripts_only,
        out_root=args.out,
    )

    print(f"\ndone — {len(produced)} produced")
    for path in produced:
        print(f"  {path}")
    return 0 if produced else 1


if __name__ == "__main__":
    raise SystemExit(main())
