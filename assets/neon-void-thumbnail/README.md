# NEON VOID — thumbnail assets

Store-ready art for the Roblox listing: three 1920×1080 thumbnail variants and one
512×512 game icon.

## Files

| File | Size | Use |
|---|---|---|
| `variant-a.png` | 1920×1080 | **Recommended primary thumbnail** — corridor rush |
| `variant-b.png` | 1920×1080 | Alternate — the Warden looming |
| `variant-c.png` | 1920×1080 | Alternate — kill moment |
| `icon.png` | 512×512 | Game icon |
| `*-small.png` | 480×270 / 128×128 | Grid-size proofs — check these before uploading |
| `src/*.html` | — | Source files; re-render to edit |

## How these were made

Not AI-generated. Every connected image generator (Pika, Higgsfield, Pixelcut) was at a
zero credit balance, so these are hand-built as layered SVG/CSS and screenshotted with
headless Chromium at exact output size.

That trade has one clear advantage: **the title text is pixel-perfect.** Image models
routinely garble in-image type, and `NEON VOID` here is real `Black Ops One` letterforms,
not a re-roll lottery. The cost is that SVG can't match a 3D render's material richness.

Each asset was designed against its own grid-size proof, then reviewed by an independent
pass that judged both sizes and flagged must-fix issues, which were applied and re-verified.

`PROMPTS.md` holds generation-ready prompts for the same four compositions, so the AI
versions can be rendered and compared like-for-like if credits are ever added.

## Art direction

Muted military-realistic base; saturation **only** on threats.

The game pivoted to a Call of Duty style, but the name and the enemy-readability rule
(magenta = threat) both need saturated colour. Resolution: environments are desaturated
grey concrete and gunmetal, and every vivid pixel belongs to an enemy, the muzzle flash,
a portal, or the title glow. Concentrating the bright pixels rather than spreading them is
what makes the tile survive a crowded games grid.

Palette — base `#06080c` `#0c1016` `#141922` `#1e2530` `#2a3240`, concrete `#3a4048`;
accents magenta `#ff2bd6` / `#ff5ce1`, cyan `#22e6ff` / `#7df4ff`, white-hot `#ffffff`.

## Re-rendering after an edit

Fonts are embedded as data URIs in `src/fonts.css`, so rendering works offline.

> **`--virtual-time-budget` is mandatory — do not drop it.**
> `@font-face` uses `font-display: block`, so Chromium draws text *invisibly* until the
> font finishes loading. Without this flag `--screenshot` can fire inside that window and
> silently produce an image with **no title, subtitle or HUD text** — the scene renders
> fine, so it looks plausible until you actually look at it. It's a race, so it fails
> intermittently. The flag makes it deterministic; verified across repeat renders.

```sh
CHROME=/opt/pw-browsers/chromium   # any Chrome/Chromium works
FLAGS="--headless --no-sandbox --disable-gpu --hide-scrollbars --virtual-time-budget=8000"

$CHROME $FLAGS --screenshot=variant-a.png --window-size=1920,1080 \
  "file://$PWD/src/variant-a.html"

$CHROME $FLAGS --screenshot=icon.png --window-size=512,512 \
  "file://$PWD/src/icon.html"
```

Always eyeball the render afterwards and confirm the title is there in blocky stencil
letterforms — a smooth generic sans means the stylesheet didn't load.

Grid-size proofs are downscaled with Pillow rather than Chromium's
`--force-device-scale-factor`, which clamps at 0.5 and can't reach these sizes:

```sh
python3 -c "
from PIL import Image
Image.open('variant-a.png').convert('RGB').resize((480,270), Image.LANCZOS).save('variant-a-small.png', optimize=True)
Image.open('icon.png').convert('RGB').resize((128,128), Image.LANCZOS).save('icon-small.png', optimize=True)"
```

## Uploading to Roblox

Game thumbnails and icons only exist **after** a place is published, and this place still
has no universe ID. Order of operations:

1. Studio → File → Publish to Roblox As… → creates the universe
2. Creator Dashboard → your game → **Thumbnails** → upload `variant-a.png`
3. Creator Dashboard → **Icon** → upload `icon.png`
4. Moderation takes a few minutes; the tile stays blank until it clears

Roblox re-encodes uploads to JPEG. These renders carry a light noise overlay specifically
to stop the dark gradients banding after re-encode — if you edit them, keep it.

Worth A/B testing `variant-c` against `variant-a` later; Roblox lets you host multiple
thumbnails and reorder them.
