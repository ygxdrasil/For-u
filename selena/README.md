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
| **Hacker News** | Official API, no key | The Algolia search API is public, keyless and unmetered. "Ask HN" threads are people describing what they need in their own words, with a permanent URL for every one. |
| **Stack Exchange** | Official API, no key | 300 requests a day without registering. Software Recommendations and Webmasters are people saying what tool they are looking for and what the existing ones get wrong. |
| **Reddit** | Search index only | The Data API's free tier is explicitly non-commercial. Not registered, by choice. Threads are cited where a search index surfaces them. |
| **Facebook / Instagram** | Search index only | The Graph API has no public keyword or hashtag search — it reaches accounts you administer, after app review. The **Meta Content Library** does expose searchable public posts, and is exactly what you would want, but it is restricted to academic and nonprofit researchers and explicitly not open to commercial or independent developers. Never fetched. |
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

## Telling her what to do

She takes orders, not questions. The home screen is a question mark that is
also the command bar:

```
watch bookkeeping for UK tradespeople daily
dig into invoice chasing for trades, deep
go looking
run
pause the invoice watch
show level 5
send the invoice one to Jason
```

Common phrasings are matched by **rule** — free, instant, identical every time.
Only a phrasing no rule recognises is worth paying a model to interpret, and
even then it may only choose among the verbs she already has. It cannot invent
an action.

Two things hold regardless of how it was parsed:

- **A misreading never acts.** Every command is read back as a plain sentence,
  and anything that spends money or changes something waits for a second press
  of enter. `dig into X, deep` shows *"research 'X' now, at deep depth — about
  $0.050, $9.40 left this month"* before it runs.
- **Nothing recognisable is bent into a command.** "make me a cup of tea" does
  nothing and lists what she does understand. She never picks a nearest match.

While she works the ? dissolves into orbiting embers, and the line beneath is
the real trace the pipeline writes as it goes — so a stall is visible rather
than hidden behind a spinner that always looks busy. A scheduled watch running
in the background shows the same animation, dimmer, so you can tell whether
she is working for you or for the clock.

---

## Going looking on her own

`go looking` — or the button on the Watches page — sets her off without a
topic. She reads the free community sources broadly for the shapes people use
when they are describing an unmet need, then makes **one** cheap model call to
sort what she read into candidate subjects. Reading costs nothing; the single
judgement call is a fraction of a penny.

What comes back is a **proposal**, not a watch. She never stands a watch or
files a finding on her own authority — proposals sit on the Watches page until
you approve or dismiss one, and a dismissed proposal is kept, not deleted, so
the same subject coming back a month later is itself a signal.

Every proposal cites the posts it came from, and a proposal citing a URL she
did not actually read is discarded by the same ledger that governs findings.

---

## Connections

Selena, Jason and Grace are separate deployments with separate tokens.
**Connections** is where you tell her where the others are and prove the line
works:

- **Test** sends one harmless line and shows you what came back. A 200 from a
  login page is reported as *"reached a web page rather than an API"*, not as
  success — a status code is not proof you reached the right thing.
- Peer tokens are **encrypted at rest** with the same secret that signs your
  sign-in, because they are somebody else's credential and a database dump
  should not be a working key into another system.
- She sends nothing to a peer on her own. Every message from this page is one
  you pressed.

Handing a finding to Jason still goes through `JASON_ENDPOINT`, and carries the
full evidence packet rather than a line of text. Adding him here as a peer is
for talking to him, not for handing work over.

---

## Signing in

The first time you open a fresh deployment it asks you to **set a password**.
That is the whole setup: pick one, and you are signed in on that browser for
**180 days**. No token to paste, nothing to re-enter.

The session is an HttpOnly cookie carrying a signed value, not a random one
looked up in a table — so signing in survives a cold start and costs no
database read per request. The signature covers which password issued it, so
**changing the password signs every other browser out**, which is the only
thing that makes changing it worth doing.

Setting a password also **closes the API**, immediately and without a redeploy.
Before one is set, a deployment with no `SELENA_TOKEN` answers anyone who finds
the URL, and says so on screen.

| | |
|---|---|
| Password storage | scrypt with a per-password salt. The password itself is never stored. |
| Wrong guesses | 10 in 15 minutes locks the door for 15 minutes. |
| Who else can claim it | If `SELENA_TOKEN` is set, creating the first password requires it. If it is not, it is first-come — the setup screen warns you. |
| Jason | Unaffected. He keeps using his bearer token; the cookie is only for you. |

`SESSION_SECRET` can be set to pin the signing key. If it is not, one is
generated and kept in the store — which is durable only as far as your database
is, so a memory-only deployment signs you out when it sleeps.

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
   | `SELENA_TOKEN` | Jason's bearer token, and proof of ownership when setting the first password | Anyone reaching the URL first can claim the password |
   | `SESSION_SECRET` | Pins the sign-in signing key | Generated once and kept in the store; lost if storage is not durable |
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
npm test          # 121 unit tests
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
- a password is never stored, sessions cannot be forged, and changing the
  password invalidates the ones issued before it
- no sentence that is not a command is ever bent into one, and rule order
  cannot silently turn "pause everything" into a watch called "everything"
- the scheduler workflow is valid YAML and every npm script points at a real file
- the deploy stays at or under eleven serverless functions, and every one of
  them has a `maxDuration` — an undeclared route silently gets Vercel's 10s
  default, which is shorter than research's own budget

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
  community.js   Hacker News and Stack Exchange — keyless, quoted verbatim
  explore.js     going looking with no topic; proposes, never files
  peers.js       where Jason and Grace are, and proof the line works
  meter.js       prices, and the hard stop
api/        one file per route, each a single path segment — eleven of them,
            because Vercel's Hobby plan stops at twelve and a test asserts it
src/        the HUD — home, dashboard, findings, watches, Jason, ask, costs,
            sources, connections, settings, behind a sidebar that collapses
```
