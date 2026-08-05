# brainrot

A zero-cost pipeline that writes, voices, illustrates, captions and renders
vertical short-form videos for TikTok and YouTube Shorts.

```
script (Gemini free tier)
  -> narration + word timings (edge-tts, free, no key)
  -> one AI still per beat (free image provider)
  -> Ken Burns motion + hard cuts (ffmpeg)
  -> karaoke word-pop captions burned in (libass)
  -> 1080x1920 H.264 MP4 + post-ready metadata
```

Two renders come out of every script — hook A and hook B — so the opening line
is always being A/B tested.

## Quick start

```bash
cd brainrot
pip install -r requirements.txt
cp .env.example .env        # optional, see Keys below
python run.py               # 5 videos, round-robin across all three series
```

No system ffmpeg needed: `imageio-ffmpeg` ships a static build with libass,
libfreetype and libx264, and the pipeline falls back to it automatically.

```bash
python run.py --series unreal_registry --count 10
python run.py --topic "elevators" --yes          # skip the review gate
python run.py --scripts-only --count 20          # write scripts, render later
python run.py --no-ab                            # one hook instead of two
python run.py --list-voices                      # every edge-tts voice
```

## Keys

Everything is optional. With no keys at all the pipeline runs end to end on
built-in scripts and procedural placeholder cards — useful for checking the
render, useless as content.

| What | Env | Free? | Where |
|---|---|---|---|
| Scripts | `GEMINI_API_KEY` | yes, no card | https://aistudio.google.com/apikey |
| Images | `POLLINATIONS_TOKEN` | free tier ≈15k images/week | https://auth.pollinations.ai |
| Images | `CF_ACCOUNT_ID` + `CF_API_TOKEN` | free tier 10k neurons/day | Cloudflare → Workers AI |

Image providers are tried in order and the first one that answers wins.
Pin one with `--images cloudflare`.

Two notes on images. Pollinations' **anonymous** endpoint no longer works —
as of 2026 every model returns `402 insufficient balance`, so a free token is
now required. And Gemini image models are excluded from the automatic chain
on purpose: unlike its text models they are not reliably free tier, and this
pipeline promises a zero-cost run. Opt in with `--images gemini` if you want
them.

## The three series

Each is a self-contained JSON file in `series/` — premise, voices, art
direction, caption identity and the writing rules the model must follow.

| Series | Format | Voice | Look |
|---|---|---|---|
| `unreal_registry` | Numbered CASE FILES on impossible things | deadpan US male | VHS analog horror |
| `wrong_history` | History that starts true and derails | fast US female | hyperreal AI photo |
| `doomer_hypeman` | Two characters argue, nobody wins | male + female | stylized 3D |

Running all three for a couple of weeks and killing the two that flop is the
intended way to use this. Editing a series is just editing its JSON — no code
changes.

## Lore bible

`state/<series>/lore.json` tracks the episode counter, everything each episode
established as canon, and every premise already published. It is fed back into
the next script prompt, which is what keeps continuity intact and stops the
model repeating itself. Delete it to reset a series.

An episode number is only consumed once its video actually renders.

## Review gate

Scripts are printed for approval before anything is rendered:

```
[enter] render · [s]kip · [r]ewrite · [q]uit
```

`--yes` or a non-interactive shell auto-accepts. Keep the gate on. It is the
cheapest quality control you have, and quality control is now a monetization
requirement rather than a nicety — see below.

## Output

```
out/<series>/<episode>-<slug>/
  hookA.mp4        1080x1920, 30fps, H.264 + AAC
  hookB.mp4        same body, different opening line
  script.json      what was written
  metadata.json    titles, description, caption, hashtags
  post.md          copy-paste ready, per platform
  work/            intermediates and the image cache
```

Videos are narration-only by design. Attach a trending sound in the TikTok app
before posting — native audio gets meaningfully better distribution than a
baked-in music bed, and it sidesteps copyright entirely.

## Why serialized, and not pure slop

YouTube renamed its "repetitious content" policy to **inauthentic content**
and, in July 2026, split the non-monetizable bucket into three: generic or
template-based content, unsatisfying or off-putting content, and AI personas
giving advice on sensitive topics. Enforcement is real — a January 2026 sweep
removed 16 channels with 4.7B lifetime views between them.

AI is not what gets punished. Sameness is. Faceless channels with original
scripts, real continuity and a consistent style remain fully monetizable.
That is the entire reason this pipeline is built around recurring characters,
a persistent lore bible and per-series art direction rather than a single
template with the words swapped out.

Practical guardrails baked in or worth keeping:

- Each series has its own voice, palette and look. They should not read as one
  channel with three skins.
- `wrong_history` carries a satire disclaimer in `post.md`. Keep it in the
  description. Fiction presented as history is the fastest route to a strike.
- Never let a series drift into health, finance or legal advice. That is
  explicitly non-monetizable when delivered by an AI persona.
- Post 1–3 a day per account, not 30. Volume without a distinct universe is
  precisely what the policy targets.

## Layout

```
run.py                CLI
series/*.json         series definitions — edit these, not the code
pipeline/
  config.py           paths, env, canvas constants
  llm.py              Gemini REST + JSON schema, offline fallback generator
  lore.py             the lore bible
  tts.py              edge-tts narration and word timings
  images.py           image provider chain
  animate.py          Ken Burns motion, optional free image-to-video
  captions.py         word timings -> karaoke ASS
  render.py           the ffmpeg assembly
  review.py           the approval gate
  ffmpeg.py           binary resolution and audio helpers
  fonts.py            fetches Anton, falls back to a system bold face
```
