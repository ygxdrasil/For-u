"""Orchestration: script -> review -> voice -> visuals -> captions -> render."""

import json
import re
import zlib
from datetime import date
from pathlib import Path

from . import animate, captions, config, fonts, ffmpeg, images, llm, lore, render, review, tts


def slugify(text: str, limit: int = 48) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug[:limit].strip("-") or "episode"


def seed_for(text: str) -> int:
    return zlib.crc32(text.encode("utf-8")) % 100_000


def write_post_notes(series: dict, script: dict, folder: Path, variants: list[str]) -> None:
    meta = script.get("metadata", {})
    tags = " ".join(meta.get("hashtags", series["hashtags"]))
    disclaimer = series.get("disclaimer")
    lines = [
        f"# {script.get('episode_label', '')} {script['title']}",
        "",
        f"Series: {series['name']}",
        f"Renders: {', '.join(variants)}",
        "",
        "## TikTok",
        "",
        f"{meta.get('tiktok_caption', script['title'])} {tags}",
        "",
        "> Attach a trending sound in-app before posting. The renders are"
        " narration-only on purpose — TikTok rewards native audio.",
        "",
        "## YouTube Shorts",
        "",
        f"**Title:** {meta.get('youtube_title', script['title'])}",
        "",
        meta.get("youtube_description", script.get("logline", "")),
        "",
        tags,
        "",
        "## Hooks under test",
        "",
    ]
    lines += [f"- **{h['variant']}** — {h['text']}" for h in script["hooks"]]
    if disclaimer:
        lines += ["", "## Required disclosure", "", disclaimer]
    (folder / "post.md").write_text("\n".join(lines) + "\n", encoding="utf-8")


def produce(
    series: dict,
    script: dict,
    out_root: Path,
    ab: bool = True,
    animate_mode: str = "kenburns",
) -> Path:
    """Render every hook variant of one script into its own folder."""
    label = script.get("episode_label", "").replace("#", "").replace(" ", "")
    folder = out_root / series["id"] / f"{slugify(label)}-{slugify(script['title'])}"
    work = folder / "work"
    work.mkdir(parents=True, exist_ok=True)

    seed = seed_for(f"{series['id']}:{script['title']}")
    font_family, fonts_dir, synthetic_bold = fonts.ensure(series["caption"].get("font", "Anton"))
    hooks = script["hooks"] if ab else script["hooks"][:1]
    variants: list[str] = []

    for hook in hooks:
        variant = hook["variant"]
        variant_dir = work / f"hook{variant}"
        variant_dir.mkdir(parents=True, exist_ok=True)

        lines = [tts.Line(hook["speaker"], hook["text"], hook["image_prompt"])]
        lines += [tts.Line(b["speaker"], b["text"], b["image_prompt"]) for b in script["beats"]]

        print(f"    voicing hook {variant} ({len(lines)} lines)…")
        narration, total, words = tts.narrate(
            lines, series["speakers"], variant_dir, series.get("pacing")
        )

        beats: list[render.Beat] = []
        for index, line in enumerate(lines):
            # Beat images are keyed on prompt+seed, so variant B reuses every
            # still variant A already downloaded — only the hook shot differs.
            image = work / f"beat{index:02d}_{variant if index == 0 else 'shared'}.jpg"
            print(f"    image {index + 1}/{len(lines)}…", end="\r")
            images.fetch(line.image_prompt, series, image, seed + index)

            clip = None
            if animate_mode == "hf":
                clip = animate.try_hf_clip(
                    image, line.image_prompt, work / f"beat{index:02d}.mp4"
                )
            beats.append(
                render.Beat(image=image, duration=max(0.4, line.end - line.start), clip=clip)
            )

        subtitles = captions.write(
            words,
            series["caption"],
            font_family,
            variant_dir / "captions.ass",
            total,
            bold=synthetic_bold,
        )
        destination = folder / f"hook{variant}.mp4"
        print(f"    rendering {destination.name} ({total:.1f}s)…      ")
        render.render(beats, narration, subtitles, fonts_dir, destination, seed=seed)
        variants.append(destination.name)

    (folder / "script.json").write_text(
        json.dumps(script, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (folder / "metadata.json").write_text(
        json.dumps(
            {
                "series": series["id"],
                "series_name": series["name"],
                "episode_label": script.get("episode_label", ""),
                "title": script["title"],
                "generated": date.today().isoformat(),
                "renders": variants,
                "hooks": {h["variant"]: h["text"] for h in script["hooks"]},
                **script.get("metadata", {}),
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    write_post_notes(series, script, folder, variants)
    return folder


def run(
    series_ids: list[str],
    count: int,
    topic: str | None = None,
    auto: bool = False,
    ab: bool = True,
    animate_mode: str = "kenburns",
    scripts_only: bool = False,
    out_root: Path | None = None,
) -> list[Path]:
    out_root = out_root or config.OUT_DIR
    produced: list[Path] = []
    books = {sid: lore.load(sid) for sid in series_ids}

    print(f"\nffmpeg: {ffmpeg.ffmpeg_bin()}")
    print(f"scripts: {'Gemini ' + config.GEMINI_MODEL if config.GEMINI_API_KEY else 'offline fallback (no GEMINI_API_KEY)'}")
    print(f"images: {images.available()}")
    print(f"output: {out_root}\n")

    for index in range(count):
        series_id = series_ids[index % len(series_ids)]
        series = config.load_series(series_id)
        book = books[series_id]

        script = None
        decision = review.SKIP
        attempts = 0
        while True:
            attempts += 1
            episode_no = lore.next_episode_number(book)
            print(f"[{index + 1}/{count}] writing {series['name']} episode {episode_no}…")
            try:
                script = llm.generate_script(series, book, episode_no, topic)
            except Exception as exc:
                print(f"    script generation failed: {exc}")
                if attempts >= 3:
                    break
                continue

            review.show(series, script, index + 1, count)
            decision = review.prompt(auto)
            if decision == review.RETRY and attempts < 4:
                continue
            if decision == review.SKIP:
                script = None
            break

        if not script:
            continue
        if decision == review.QUIT:
            break

        if scripts_only:
            folder = out_root / series_id / "scripts"
            folder.mkdir(parents=True, exist_ok=True)
            path = folder / f"{slugify(script.get('episode_label', ''))}-{slugify(script['title'])}.json"
            path.write_text(json.dumps(script, indent=2, ensure_ascii=False), encoding="utf-8")
            produced.append(path)
            lore.record(book, script)
            lore.save(book)
            continue

        try:
            produced.append(produce(series, script, out_root, ab=ab, animate_mode=animate_mode))
        except Exception as exc:
            print(f"    render failed: {exc}")
            continue

        # Only burn an episode number once the episode actually exists.
        lore.record(book, script)
        lore.save(book)

    return produced
