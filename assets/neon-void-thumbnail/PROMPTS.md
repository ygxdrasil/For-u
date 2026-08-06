# NEON VOID — thumbnail prompt pack

Generation-ready prompts for the Roblox game thumbnail. Written for Pika / Higgsfield /
any text-to-image model. Not yet rendered — all three connected generators were at zero
credit balance at the time of writing.

## Output specs

| Asset | Ratio | Size | Notes |
|---|---|---|---|
| Game thumbnail | 16:9 | 1920x1080 | Render at 2K and downscale; Roblox re-encodes anyway |
| Game icon | 1:1 | 512x512 | Must read at ~150px in the games grid |

## Art direction

Muted military-realistic base, neon **only** on the threats.

The game pivoted to a Call of Duty style, but the name and the enemy readability rule
(magenta = threat) both depend on saturated colour. Resolution: the environment is
desaturated grey concrete and gunmetal; every vivid pixel in the frame belongs to an
enemy, the muzzle flash, or a portal. This keeps the name meaning something and makes
the thumbnail read at grid size, because all the bright pixels are concentrated rather
than spread evenly across the image.

Composition is first-person POV with an enemy rush — it sells the newly forced
first-person combat, and a weapon plus crosshair is legible even as a small tile.

---

## Variant A — corridor rush (recommended first roll)

> Roblox game thumbnail poster, 16:9 landscape. First-person shooter point of view: a
> blocky Roblox-style tactical assault rifle held in the lower right of frame, hot muzzle
> flash bursting from the barrel, blocky gloved hands gripping it. The view looks down a
> dark industrial arena corridor built from muted gunmetal grey and desaturated concrete
> blocks — gritty military sci-fi, dust and haze in the air, scuffed metal panels.
> Charging straight toward the camera are five angular blocky robot enemies built from
> glowing magenta and cyan neon panels with bright glowing cores; these enemies are the
> ONLY saturated colour in the shot, throwing hot pink and cyan light that spills across
> the grey walls and floor. A thin white FPS crosshair dead centre of frame. Far behind
> the enemies, a tall glowing cyan portal doorway lighting the corridor end. Cinematic
> volumetric god rays, strong rim lighting, high contrast, deep shadows, ultra detailed 3D
> game render, Roblox blocky stud geometry. Large bold title text reading exactly "NEON
> VOID" across the upper third of the image in a heavy condensed military stencil
> typeface, white with a magenta neon edge glow and subtle chromatic fringe. High energy
> action poster composition, very dark background so the neon reads instantly at small
> size.

## Variant B — boss looming

> Roblox game thumbnail poster, 16:9 landscape. First-person shooter view: a chunky blocky
> Roblox-style sci-fi rifle angled up from the bottom centre-right of frame, muzzle flash
> and ejecting shell casings, blocky armoured hands. Setting is a huge dark arena hangar of
> muted grey-brown industrial blocks, riveted steel plating, smoke and floating dust,
> desaturated realistic military palette. In the mid-ground a swarm of small angular blocky
> drones glowing electric magenta rush the camera, one of them mid-explosion bursting into
> tumbling glowing shards. Looming behind them in the smoke is a massive dark saucer-shaped
> boss machine with a blinding cyan glowing core ring, silhouetted, dwarfing everything.
> Thin white crosshair centred. The neon magenta and cyan enemy glow is the only vivid
> colour against the grey world, casting coloured light pools on the floor. Cinematic
> wide-angle lens, dramatic backlight, volumetric haze, ultra detailed 3D render, Roblox
> blocky geometry. Bold title text reading exactly "NEON VOID" placed across the lower
> third, heavy wide military stencil letters in white with cyan neon outer glow. Dark,
> moody, high-contrast action poster.

Matches the in-game Warden, which generated as a saucer hull rather than a sphere.

## Variant C — kill moment

> Roblox game thumbnail poster, 16:9 landscape, extremely high impact. First-person shooter
> perspective: blocky Roblox-style tactical rifle in the lower right corner with a bright
> muzzle flash, blocky hands. Directly ahead, close to the camera, a blocky neon-magenta
> robot enemy is exploding apart mid-kill — its glowing armour plates shattering into
> tumbling luminous shards flying toward the viewer, hot pink light blasting outward.
> Behind it, more angular blocky enemies with cyan glowing cores charge through a dark
> gritty military arena of muted grey concrete and gunmetal steel, dust and smoke
> everywhere. Thin white FPS crosshair dead centre on the exploding enemy. The environment
> is desaturated realistic military grey; every saturated colour in the frame comes from
> the neon enemies, the muzzle flash, and a distant cyan portal glow. Cinematic dramatic
> lighting, motion energy, sparks, volumetric smoke, ultra detailed 3D game render, Roblox
> blocky stud geometry. Large bold title text reading exactly "NEON VOID" across the top of
> the image in a heavy condensed stencil typeface, white letters with intense magenta neon
> glow. Dark background, extreme contrast, designed to grab attention in a crowded game
> listing.

Directly mirrors the shed-plates death effect already built into the enemies.

## Icon — 512x512

Derive from whichever variant wins so the pair reads as one set. Standalone fallback:

> Roblox game icon, square 1:1, bold and readable at small size. Extreme close-up of a
> single angular blocky robot enemy head with a blazing magenta neon core and cyan glowing
> panel seams, facing the viewer head-on, against a near-black dark grey industrial
> background. Sharp rim lighting, heavy contrast, glowing volumetric haze around the core.
> Ultra detailed 3D render, Roblox blocky stud geometry. Minimal composition, one strong
> centred silhouette, no text. Vivid magenta and cyan against desaturated gunmetal.

Deliberately text-free: at ~150px the game name already sits beneath the tile, so an icon
carrying the title too just wastes the space on unreadable letters.

## Notes when rendering

- Keep the exact string `NEON VOID` quoted in the prompt — models drop or garble unquoted
  in-image text far more often.
- If the title renders misspelled, re-roll rather than fixing in post; the letterforms are
  usually wrong in more than one place.
- Seedream Pro and Nano Banana Pro are the two strongest at large in-image title text.
  Neither supports multi-image batching, so each variant is a separate call.
- Roblox re-encodes uploads to JPEG. Avoid fine dithered gradients in the darks — they
  band badly after re-encode. The high-contrast direction here is already safe.
