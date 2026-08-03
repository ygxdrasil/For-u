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

## Talking to them

The ladder proves people pay **somebody**. It cannot tell you what they would
pay **you**, or whether they would switch — and that is the question that
decides whether to build. No API answers it. Only a reply from a person does.

So every finding has a **Talk to them** panel. It works out who behind the
quotes is actually reachable, what each platform's rules allow, and drafts an
opener per person built from that person's own words — opening with what they
said, asking what they do about it today and what that costs, naming no price
and pitching nothing.

Two rules are load-bearing:

**She does not send.** Every draft gets a copy button and a link to the thread;
you send it, from your account, having read it. That was set as a limit at the
start and `core/reach.js` contains no network call at all. A test asserts the
drafts carry no `sent`, `endpoint` or `deliver` field, so a later change cannot
grow one by accident.

**A reply never moves the level.** "I'd pay £30 a month" is the most valuable
sentence in this system and it is *not* evidence of payment — stated intent and
revealed behaviour differ reliably, and in one direction. Replies live in
`finding.conversations`, a sibling of `evidence` and never a member of it;
`computeEvidence` is handed `finding.evidence` and cannot see them.
`tests/evidence.test.js` asks five people, has all five say yes with a number,
and asserts the finding is still level 1. What someone *already pays* and what
someone *says they would pay* are stored as two separate fields and never
merged.

Contactability is very uneven, and the panel says so rather than implying
everyone can be reached:

| Source | Route |
|---|---|
| Hacker News, Lemmy, Shopify/n8n/Make forums, GitHub | reply in the thread — normal and allowed |
| Stack Exchange | **careful** — comments are for improving the question; use the profile |
| USAspending | a named company, contactable through its own public details |
| Booksy / Fresha / Tradify / ServiceM8 / Square reviews | **none** — a display name is not a route |
| CFPB | **none** — published with the complainant removed |

That table is the uncomfortable part, stated rather than hidden: the review
feeds are the *strongest* evidence in the system and the least contactable. An
unrecognised host is reported as "nobody has checked what this site allows",
never as probably fine — an unsolicited message on the wrong forum costs you
the account, not her.

Replies reach Jason as their own `askedDirectly` block, labelled as what people
*said* rather than what they *did*, with the refusals travelling alongside the
yeses.

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
| **Discourse forums** | Official API, no key | The quiet winner. Thousands of trade and niche-business forums run Discourse, and every public one answers the same documented JSON API anonymously. This is how you reach barbers, letting agents and florists — not one big platform, but a hundred small forums that all speak the same protocol. Verified live. |
| **App Store reviews** | Official API, no key | Apple's customer-reviews feed: ~500 recent reviews an app, keyless. One of the few places paying and complaining sit in the same sentence — a level-4 shape out of the box. Verified live. |
| **Public procurement** | Official API | USAspending needs no key at all; SAM.gov, TED and UK Contracts Finder need a free one. Itemised, published proof that someone is paying. Verified live: a real HVAC contract with a public link. |
| **Product Hunt** | Official API | Free developer token in about a minute, read-only public scope. Good for the other half of a finding: what exists, what it charges, what the comments say it does not do. |
| **Upwork / Thumbtack / Nextdoor** | Application-gated | All three have real APIs and none is open. Upwork needs an approved OAuth app; Thumbtack's is a partner Leads API by request; Nextdoor's portal is gated to advertising partners, publishers and public agencies. Connect them on the Connect page if you get approved. |
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
work on your own
stand down
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

## Connecting your own sources

The table above is the fixed policy. **Connect** is the other half: a place to
paste an API you hold a key for, or an MCP server, and have her actually read
it on every run.

Two kinds, because those are the two things that exist:

- **An API.** A URL with `{query}` where the search term goes, GET or POST, and
  a short map saying which fields hold the words and the link. The path
  language is dots for keys, `[]` for a list, `|` between alternatives —
  `data.items[].title` is the whole vocabulary. When a source hands back an id
  or a slug instead of a link, a template builds one: `https://forum/t/{slug}/{id}`.
- **An MCP server.** She lists its tools, you pick the one that searches, and
  she calls it. The July 2026 revision removed the initialize handshake and
  requires new routing headers; plenty of servers are still on the older
  session-based spec. She tries the current shape first, falls back to the
  handshake, and remembers which the server speaks so the probe is paid once.

**Ready to connect** sits at the top of that page: six sources already worked
out, each probed against the live API — the URL, the field map and the link
template — with the counts shown being what actually came back on the day.
One press connects the lot.

| | Gives | Checked live |
|---|---|---|
| Shopify Community | asks, complaints | 50 of 50 posts citable |
| n8n Community | asks, complaints | 50 of 50 posts citable |
| Make.com Community | asks, complaints | 50 of 50 posts citable |
| Lemmy (federated) | asks, complaints | 20 of 20 posts citable |
| GitHub issue search | asks, complaints | 20 of 20 issues citable |
| **CFPB consumer complaints** | **paying**, complaints | 20 of 20 citable, detail pages resolve |
| **US contract awards** | **paying**, incumbents | 20 of 20 citable — a real HVAC contract |
| Federal Register | asks | 20 of 20 documents citable |
| npm registry | incumbents | 20 of 20 packages citable |
| **Booksy Biz** (barbers, salons) | **paying**, complaints | 50 citable, 8 at ≤3 stars |
| **Fresha for business** | **paying**, complaints | 50 citable, 20 at ≤3 stars |
| **Tradify** (trades) | **paying**, complaints | 50 citable, 14 at ≤3 stars |
| **ServiceM8** (field service) | **paying**, complaints | 50 citable, 15 at ≤3 stars |
| **Square POS** | **paying**, complaints | 50 citable, 30 at ≤3 stars |

Twelve of the fourteen are ticked by default, which is exactly the per-run
ceiling — so every default source is read on every run and none is quietly
dropped. It was nine, on the theory that more sources make a run slow and noisy
without making it better. Measuring killed that theory: the extra sources cost
about a second each, and the noise was never breadth. It was that only the
first twelve posts reached the model, in arrival order, which meant one forum
and nothing else. Now the sample is taken evenly across sources, so switching
one on genuinely means hearing from it. The two left off are the two carrying
no demand at all — a package index and a rulemaking feed — and both are one
tick away.

**On MCP, plainly:** five public servers with no authentication were probed and
all five answered — DeepWiki, Context7, GitMCP, Hugging Face and grep.app. None
is in the set, because none carries demand: they are repository docs, library
lookups and literal code-pattern search. grep.app refuses a natural-language
query outright. The MCP client works and is tested against both protocol
dialects; there is simply nothing public worth pointing it at yet. An
authenticated server you hold a token for is a different matter, and Connect
takes those.

The review feeds are the valuable half, and deliberately the *business-side*
apps: Booksy and Fresha each have a consumer app with far more ratings whose
reviews are people rating their haircut. These are the ones the shop pays for,
so a complaint is a paying customer saying what is wrong — the shape of a
level-4 finding, from a free source.

A review feed is a standing corpus, not a search: it names one app and always
returns its most recent reviews, so no search term is bolted onto it and the
page says so rather than implying otherwise.

Recipes for a Discourse forum of your own, App Store reviews for any other app,
and public contract awards are below that — all verified against the live APIs
too, not written from memory.

Three things hold:

- **A test is not a status code.** It runs one real search and shows you the
  posts that came back, with their links. "It answered 200 but the field map
  found nothing in it" is reported as its own outcome, because that is the way
  a connection silently reads nothing for a month.
- **An item with no usable link is dropped.** Not kept with a placeholder. A
  quote she cannot cite is not evidence, and the count of what was dropped is
  shown rather than hidden.
- **A pasted URL does not bypass the policy.** `assertFetchAllowed` runs on it
  at add time and again at read time. Pasting a blocked host on a settings page
  does not change what that platform's terms say — but the API hostnames are
  not blocked, so a real approved key works.

Keys are encrypted at rest with the same secret that signs your sign-in, and
never sent back to the browser.

---

## Keys: paste, or deploy

Every key can be an environment variable, and every key can be pasted on the
**Settings** page instead. Getting an Etsy keystring approved and then having
to open a dashboard, add a variable and wait for a rebuild is three steps too
many, none of which happens where you are standing when the key arrives.

One rule between them: **the environment always wins where it is set**, the
same as Jason's endpoint and for the same reason — when the two disagree you
want the answer to be the one in your deploy config, not the one somebody
clicked. If both exist the page says so and names the one being ignored.

- **Test it** makes a real call to the real service with the value you just
  typed, *before* it is stored. Etsy refuses a keystring on its own with
  "Shared secret is required in x-api-key header", and the dashboard shows the
  two halves in separate columns — so pasting half of it is the obvious mistake
  and this is where you find out, not in a sweep next Tuesday.
- **Values go one way only.** They are encrypted with the same secret that
  signs your sign-in, and the status endpoint reports whether a key is set,
  where it came from, and the last four characters. Nothing else.
- **Forgetting one really removes it.** That is the single exception to "never
  delete anything ever": that rule is about evidence and findings, which are
  the record. A revoked credential is a liability, not an audit trail — what is
  kept is that it was cleared, and when.

`DATABASE_URL` and `SESSION_SECRET` are deliberately not pasteable: the first
is read before the store exists, and the second is what decrypts this table.

---

## Setting her going

The switch is at the bottom of the sidebar, on every page, and it is one press.
Armed, twice a day she reads with no topic from you, **stands her own watches**
on what looks real, researches them, files findings, and sends the strongest
**straight to Jason without asking**.

That last step overrides the deliberate-handoff rule this project started with.
It was overridden deliberately. Everything below is the trade for it, and every
one is a number in `core/autonomy.js` checked in code — not a prompt asking her
nicely:

| Brake | Default | What it stops |
|---|---|---|
| **Reserve** | $2 of the $10 cap | She can never spend the month before you have asked her anything. Her ceiling is $8; yours is always there. |
| **Handoff floor** | level 5 | Many paying, many complaining, **and the complaints agree**. A level-4 finding never goes unattended, however buildable. |
| **Weekly ceiling** | 3 | However good a week is, Jason gets at most three on her authority. Enforced *within* a single pass, not just across passes. |
| **Quiet backoff** | 3 runs | Three passes finding nothing and she roams every other pass instead, rather than re-reading the same posts every twelve hours. One find resets it. |
| **Error stop** | 3 runs | Three failed passes and she disarms herself and says so. Broken is not the same as quiet, and retrying on a schedule is how you spend a month finding that out. |
| **Provenance halt** | always on | A run that had claims deleted for citing something it never read files **nothing** — not the parts that checked out. Attended you can judge; unattended there is nobody to. |
| **Her own watches** | 8 | A ceiling on watches she stands for herself, each recorded with why she looked there. |

She refuses to arm at all without a model key or without `DATABASE_URL`.
Arming her to fail on a schedule looks like it worked, which is worse than not
arming her.

**Stop everything** is in the rail too: it disarms her *and* pauses every watch,
from any page. Typing `stop everything` does the same thing — pausing the
watches while leaving her armed to roam and hand things over is the most
dangerous possible reading of those words, so it is not the one she takes.

Roaming happens **after** the watches on every pass. Finding new things is the
exciting part and it is the part that should be starved first: a watch you
approved has already earned its money and a new subject has not.

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

   `vercel.json` sets `ignoreCommand` to `git diff --quiet HEAD^ HEAD -- .`,
   which builds only when something in this directory changed. Two projects
   deploy from this one repo, so every push used to build both, and two builds
   per push exhausted the Hobby plan's daily deployment limit in an afternoon.
   Vercel skips the build when the command exits 0, which is exactly what
   `git diff --quiet` does when nothing here moved.

   That paragraph lives here, and not in `vercel.json` as a `_comment_` key,
   because **Vercel validates `vercel.json` against a closed schema before the
   build starts**. An unknown top-level key does not warn and is not ignored:
   the deployment fails outright with `should NOT have additional property`,
   produces no build logs because no build begins, and cannot be redeployed
   from the dashboard because there is nothing to repeat. A comment key added
   to explain this very setting took both projects down for a day.
   `tests/structure.test.js` now fails on any key Vercel does not know.

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
- she starts disarmed, a mangled record cannot read as armed, and no brake can
  be widened by a bad number or reset by a settings change
- two passes running at once cannot lose a counter increment — for an error
  counter that would mean the brake never trips
- a hostile source cannot smuggle a `javascript:` link into a citation, fill a
  prompt with one enormous field, reach Object.prototype through a field map,
  or rewrite which host a link template points at
- a finding is never handed over unattended without a POSITIVE buildability
  verdict — "partly" and "never classified" are refused, because unattended is
  exactly when nobody is there to read the classification
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
  connectors.js  the APIs and MCP servers you plug in yourself
  starters.js    the verified set, probed live and ready to connect
  reach.js       who can be talked to, what to say, and what they said back;
                 contains no network call, deliberately
  autonomy.js    the brakes: reserve, floor, ceiling, backoff, stop
  pass.js        one unattended pass: watch → roam → stand → hand over
  peers.js       where Jason and Grace are, and proof the line works
  meter.js       prices, and the hard stop
api/        one file per route, each a single path segment — eleven of them,
            because Vercel's Hobby plan stops at twelve and a test asserts it
src/        the HUD — home, dashboard, findings, watches, Jason, ask, costs,
            sources, connections, settings, behind a sidebar that collapses
```
