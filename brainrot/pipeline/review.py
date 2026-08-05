"""Human approval gate between writing and rendering.

Rendering is the slow part and posting slop is the expensive part, so scripts
get read before either happens. Non-interactive runs (CI, cron, --yes) skip it.
"""

import sys

ACCEPT = "accept"
SKIP = "skip"
RETRY = "retry"
QUIT = "quit"


def show(series: dict, script: dict, index: int, total: int) -> None:
    bar = "─" * 62
    print(f"\n{bar}")
    print(f"  {series['name']}  ·  script {index}/{total}")
    print(f"  {script.get('episode_label', '')}  {script['title']}")
    if script.get("logline"):
        print(f"  {script['logline']}")
    print(bar)
    for hook in script["hooks"]:
        print(f"  HOOK {hook['variant']} [{hook['speaker']}]  {hook['text']}")
    print()
    words = 0
    for beat in script["beats"]:
        words += len(beat["text"].split())
        print(f"  [{beat['speaker']}] {beat['text']}")
    print()
    print(f"  {len(script['beats'])} beats · ~{words} words · ~{words / 2.6:.0f}s spoken")
    meta = script.get("metadata", {})
    if meta:
        print(f"  YT: {meta.get('youtube_title', '')}")
        print(f"  TT: {meta.get('tiktok_caption', '')}")
    print(bar)


def prompt(auto: bool) -> str:
    if auto or not sys.stdin.isatty():
        return ACCEPT
    while True:
        answer = input("  [enter] render · [s]kip · [r]ewrite · [q]uit > ").strip().lower()
        if answer in ("", "a", "y"):
            return ACCEPT
        if answer == "s":
            return SKIP
        if answer == "r":
            return RETRY
        if answer == "q":
            return QUIT
