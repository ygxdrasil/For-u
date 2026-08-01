# Selena

Finds unmet demand — things small businesses and freelancers need, are already
paying for, and are badly served on — and understands each one well enough that
Jason can build something for it without going back for another round.

She finds and understands. Jason builds. Nothing is handed to him automatically.

---

## What makes a finding real

Evidence is a ladder, and the level is **computed from what was extracted**,
never claimed by the model:

| Level | Meaning |
|---|---|
| 1 | Someone asks. Talk is cheap. |
| 2 | Asked repeatedly, or by several people. |
| 3 | Someone is **paying** — a real price on a real listing. |
| 4 | Paying **and complaining**. |
| 5 | Many paying, many complaining, **and the complaints agree**. |

Anything below 3 is stored as a `hypothesis`, not a finding. Level 5 also
requires that something was actually *read* — if every source is a search
snippet we never opened, it is held at 4 and says so.

## The control that matters

Every URL a run actually touched goes into a **source ledger** with its status
and a content hash. Before a finding is stored, every quote, price, incumbent
and number is checked against that ledger *for that run*. A claim whose URL is
not in it is **deleted** — not flagged, not kept with a warning.

A volume estimate additionally needs a real derivation. "Industry knowledge" is
discarded and replaced with `not established`, because a fabricated market size
that reaches Jason becomes a product built for nobody.

`risks` is a required, non-empty field. An engine that only ever finds
opportunities is an expensive way to be told what you want to hear.

---

## Sources, and the honest position

Checked against each platform's own documentation on 2026-07-31.

| Source | Access | Why |
|---|---|---|
| **Etsy** | Official API | Marketplace listing search *and* listing/shop reviews need **no OAuth scope** — an API keystring is the only auth. Both halves of a level-4 finding from one authorised place. |
| **Reddit** | Search index only | The Data API's free tier is explicitly non-commercial. Not registered, by choice. Threads are cited where a search index surfaces them. |
| **Facebook / Instagram** | Search index only | The Graph API has no public search — it reaches accounts you own, after app review. Never fetched. |
| **Gumroad** | Search index only | API v2 is scoped to your own products; there is no public discovery. Their terms forbid crawlers outright. |
| **Fiverr** | Search index only | No public API. robots.txt disallows `/search/` and `/gigs/search` for every agent, and their Community Standards prohibit scraping. |
| **Open web** | Grounded search | Ordinary sites, via Gemini's Google Search grounding. |

Google's own Custom Search JSON API is **closed to new customers** and retires
2027-01-01, so grounding is the route to Google results.

"Search index only" is enforced in code, not promised in a prompt:
`assertFetchAllowed()` in `core/sources.js` throws on those hosts, and a test
asserts it.

**She never** messages anyone, posts anywhere, logs into anything, deletes
anything, or spends past the cap.

---

## Deploying

1. **Import `selena/` as its own Vercel project.** Set the root directory to
   `selena`. It is deliberately separate from `assistant/` so a bad build here
   can never take Jason down.

2. **Environment variables.** All optional — she deploys and runs with none of
   them, and says on screen exactly what she cannot do without each.

   | Variable | What it buys | Without it |
   |---|---|---|
   | `GEMINI_API_KEY` | Reading the web | She runs, shows her state, and refuses to produce findings she cannot source |
   | `DATABASE_URL` | Durable storage (Neon, free tier) | Memory only — survives within a warm instance, lost on cold start. Banner says so |
   | `SELENA_TOKEN` | Auth on every route | **The API answers anyone who finds the URL.** Red banner until set |
   | `ETSY_API_KEY` | The strongest evidence source, as `keystring:shared_secret` | Etsy is dark; everything else still works |
   | `JASON_ENDPOINT` | Where handoff packets are POSTed | Packets are prepared and recorded, not sent |
   | `JASON_TOKEN` | Bearer token for that endpoint | Sent without auth |
   | `MONTHLY_USD_CAP` | Spend ceiling (default 10) | 10 |

3. **Verify the deploy.** `curl https://<your-app>/api/health` and check
   `build.buildId` matches the `buildId` on the Settings page. They are stamped
   from the same value in the same run — if they differ, one half is stale. A
   server-only change leaves the frontend bundle byte-identical, so this is the
   only way to tell.

4. **Turn on the watches.** Add repository secrets `SELENA_URL` and
   `SELENA_TOKEN`, and `.github/workflows/selena-watches.yml` sweeps twice a
   day. Without them the job exits cleanly rather than failing every morning.

### Getting the Etsy key

Register a **Personal App** at <https://www.etsy.com/developers/register>.
Etsy reviews these by hand. A Seller App is approved in minutes but is
restricted to your own shop and forbids commercial use, which is not what this
does. The keystring goes in as `keystring:shared_secret`.

---

## Costs

Metered from reported usage and checked **before** each request, never after.

- Gemini 2.5 Flash: $0.30 / $2.50 per million tokens
- Grounding with Google Search: **1,500 free requests a day** on 2.5 models,
  then $35 per 1,000
- Etsy, Neon and GitHub Actions: free tiers

Three daily watches land around **$2–4/month**. When a run would cross the cap
it stops mid-dig, keeps everything already verified, and files the finding
marked `stoppedEarly`. The Costs page shows spend per watch and cost per thing
actually reported, so a watch that spends and never says anything is obvious.

Prices are read from the provider's pricing page, not recalled — see
`PRICES_CHECKED_ON` in `core/meter.js`. An unpriced model is a loud error, never
a guessed rate.

---

## Jason's seam

Two token-authed endpoints. Both are callers of the same `runResearch()`; there
is deliberately no second copy of the pipeline anywhere.

```
POST /api/research
  { "topic": "...", "depth": "glance|check|dig|deep", "save": true }
  -> { finding, summary, notes, depth, costUsd, sourcesRead, stoppedEarly }

POST /api/ask
  { "question": "...", "mode": "auto|stored|research" }
  -> { answer, confidence, basedOn: [urls], rejectedCitations, unknowns, costUsd }

Authorization: Bearer <SELENA_TOKEN>
```

`mode: "stored"` answers from findings already on record for nothing. `auto`
only pays to read when the record cannot answer.

Handing a finding over is deliberate — `POST /api/handoff` with an id, from the
**For Jason** page. She refuses findings she has classified as things he cannot
build unless you override it on purpose.

---

## Running it locally

Node is invoked directly everywhere; nothing calls a bare CLI name, because
`.cmd`/`.bat` shims are blocked by group policy on the target machine.

```
node node_modules/vite/bin/vite.js build      # or: npm run build
node scripts/dev-server.mjs --port 3101 --static dist
```

`scripts/dev-server.mjs` mounts the same `api/*.js` handlers Vercel runs, and
reproduces Vercel's routing rule — `/api/x` works, `/api/x/y` 404s — so that
difference is found locally rather than in production.

If Node cannot verify HTTPS behind corporate TLS interception, use
`node --use-system-ca` or `NODE_EXTRA_CA_CERTS`. Never
`NODE_TLS_REJECT_UNAUTHORIZED=0`.

## Tests

```
npm test          # 87 unit tests
npm run selftest  # 17 end-to-end checks, whole pipeline, network stubbed
npm run stress    # 29 hostile-input cases; keeps going and reports every one
npm run dbtest    # 18 checks driving the REAL Postgres store against a real Postgres
```

`dbtest` needs an embedded Postgres, which is deliberately not a dependency:
`npm install --no-save @electric-sql/pglite` first. It runs every statement in
`core/store.neon.js` for real and asserts the Postgres and memory stores
**agree** — a store that behaves one way locally and another in production is
worse than one that is broken in both.

The suites exist to reproduce specific failures, not describe them. Among the
things they hold in place:

- a fabricated citation is deleted and the evidence level falls with it
- an invented market size never reaches Jason
- a watch reports once and then stays quiet until something actually changes
- the budget stop is checked before spending, and a stopped run keeps what it verified
- every API route is a single path segment
- `vercel.json` headers match `core/headers.js` exactly
- no `DELETE FROM` exists anywhere in the source
- the scheduler workflow is valid YAML and every npm script points at a real file

---

## Layout

```
core/       the headless engine — no HTTP, no React, no cron
  research.js    the one pipeline: plan → search → read → verify → score → record
  evidence.js    the ladder, computed
  ledger.js      per-run provenance; the anti-fabrication control
  schema.js      the finding schema and its validator
  buildability.js  what Jason can and cannot build
  sources.js     the source policy, enforced
  meter.js       prices, and the hard stop
api/        one file per route, each a single path segment
src/        the HUD — dashboard, findings, watches, Jason, ask, costs, sources, settings
```
