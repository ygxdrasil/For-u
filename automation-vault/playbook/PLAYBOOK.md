# The Automation Vault Playbook

## From Workflow Files to a Working Product Line

You now own ten hardened n8n workflows. This playbook is the other half of the purchase: the operational manual for turning those files into paid installs. Everything here comes from patterns that hold up in real client deployments — the numbers are ranges we've seen work, not promises, and every example scenario in this guide is illustrative, not a case study.

Read it once end to end. Then use it as a reference while you sell and deliver.

---

## 1. The $500 Install

Here is the entire business model in one paragraph: a local business has a repetitive, revenue-touching process — missed calls, unanswered leads, no-show appointments, unposted reviews. You install one workflow from the Vault that fixes it, charge a one-time setup fee of $300–$1,500, and optionally charge $50–$200/month to keep it running. That's it. No agency brand required, no team, no retainer negotiations with procurement departments.

Why this works economically:

- **Your delivery cost is hours, not days.** The workflows are pre-built and pre-hardened. A typical install is 3–6 hours of configuration, testing, and handoff once you've done your first two or three. At $500 for a 4-hour install, you're earning $125/hour. At $1,200 for a more involved deployment, more.
- **The value gap is real.** A dental practice that recovers two missed-call bookings a month from a missed-call text-back workflow has covered a $500 setup fee many times over in a year. You're selling recovered revenue, not software.
- **Maintenance is where the business compounds.** One-off installs pay the bills; ten clients on $100/month retainers is $12,000/year of recurring income for a few hours of monthly monitoring.

Now the honest constraints, because hype is how people quit in month two:

- **Your first install will take three times as long as you expect.** Budget a full day, maybe two. Speed comes from repetition, not from the templates alone.
- **Sales is the actual job.** The workflows are the easy part. Expect to have 10–20 real conversations to land your first paying client. Local business owners buy from people they trust, which usually means referrals, walk-ins, local networking, or a warm intro — not cold DMs.
- **This is a service business with product leverage**, not passive income. Nobody wakes up to money. You wake up to a Slack message that a webhook failed — which is exactly why the Vault workflows ship with retry logic and error alerting, so those messages are rare and actionable.

Realistic trajectory for someone doing this seriously on nights and weekends: first client in weeks 2–6, three to five clients by month three, and a decision point around month four — stay a side income at $1,000–$2,500/month, or specialize and scale (Section 8).

---

## 2. Picking Your Niche and Matching Workflows

The single biggest mistake new operators make is selling "automation" to "businesses." Nobody buys a category. They buy "your missed calls become booked appointments."

**Pick one niche first.** Criteria, in order:

1. **You can reach them.** Your dentist, your barber, a realtor you know. Warm access beats perfect market fit.
2. **They lose money on a visible, nameable problem.** Missed calls, no-shows, slow lead response, unanswered reviews.
3. **They already spend money on software or marketing.** A business paying for Google Ads understands paying to capture the leads those ads generate.

### Workflow-to-Niche Mapping

| # | Vault Workflow | Best-Fit Businesses | The Pitch in One Line | Typical Setup Fee |
|---|---|---|---|---|
| 1 | Missed-Call Text-Back | Dentists, salons, contractors, med spas | "Every missed call gets an instant text so the caller books instead of calling your competitor." | $400–$800 |
| 2 | AI Lead Qualifier & Router | Realtors, agencies, consultants | "Every inbound lead answered and qualified in under a minute, 24/7." | $600–$1,200 |
| 3 | Appointment Reminder & No-Show Recovery | Dentists, salons, med spas, clinics | "Cut no-shows with smart reminders and auto-rebooking." | $400–$900 |
| 4 | Review Request & Response Engine | Salons, dentists, restaurants, contractors | "More 5-star reviews on autopilot, and every review gets a reply." | $300–$700 |
| 5 | AI FAQ / Website Chat Concierge | All local service businesses, e-com | "Your website answers questions and books appointments while you sleep." | $500–$1,200 |
| 6 | Abandoned Cart & Winback Sequences | E-commerce | "Recover carts and lapsed customers with sequences that don't feel like spam." | $500–$1,500 |
| 7 | Client Onboarding Pipeline | Agencies, consultants, law/accounting firms | "New client signed → contracts, folders, kickoff, and welcome email happen automatically." | $600–$1,500 |
| 8 | Content Repurposing Engine | Agencies, realtors, coaches/consultants | "One piece of content becomes a week of posts, drafted for your approval." | $400–$900 |
| 9 | Invoice Chase & Payment Reminders | Contractors, agencies, consultants | "Polite, persistent follow-up on unpaid invoices without you sending a single email." | $400–$800 |
| 10 | Lead Enrichment & CRM Sync | Realtors, agencies, B2B consultants | "Every lead lands in your CRM enriched, deduplicated, and tagged." | $500–$1,000 |

**Recommended starter combos:** Dentists or salons + Workflows 1, 3, and 4 (the "front desk stack"). Realtors + Workflows 2 and 10. Agencies + Workflows 7 and 9. E-commerce + Workflow 6. Start by selling ONE workflow, then expand the same client into the stack — a second sale to an existing client is ten times easier than a first sale to a stranger.

---

## 3. n8n Hosting for Beginners

Every install needs to run somewhere. You have two sane options.

### Option A: n8n Cloud (start here)

n8n's hosted service. You create an account, import the workflow, done. No servers, no updates, no SSL, no 2 a.m. maintenance.

- **Cost:** Starter tiers have historically run roughly $20–$25/month per instance; check current pricing since plans change. Execution limits matter — a missed-call workflow for one dentist uses a tiny fraction of any plan.
- **Choose it when:** you have 1–5 clients, you're not comfortable administering a Linux server, or the client wants to own the account (they pay n8n directly, you just build in it — this is the cleanest ownership model and my default recommendation for your first several installs).

### Option B: Self-Hosting (graduate to this)

n8n's community edition on a VPS you control — Hetzner, DigitalOcean, or similar, typically $6–$15/month for a box that comfortably runs many client workflows. Use Docker; the setup is well-documented and takes an evening.

- **Real costs beyond the VPS:** your time. You own updates, backups, SSL renewal, and uptime. Budget 1–2 hours a month once it's stable. Also review n8n's Sustainable Use License before hosting workflows for multiple paying clients on one instance — licensing terms for commercial multi-client hosting have specifics you should read yourself rather than take from any guide, this one included.
- **Choose it when:** you have 5+ clients and the per-client cloud fees exceed one VPS plus your admin time, or a client has data-residency requirements.

### The decision in one sentence

**Until roughly client five, put each client on their own n8n Cloud account that they pay for.** You avoid becoming an unpaid hosting company, the client owns their infrastructure (great for trust and for your objection handling in Section 4), and if you ever part ways the handoff is clean. Self-host later, deliberately, as a margin decision — and when you do, charge for it: hosting bundled into the maintenance retainer is a $25–$50/month line item.

One non-negotiable either way: **every client runs in a separate instance or, at minimum, a strictly separated project with separate credentials.** Never share credentials across clients. Ever.

---

## 4. The Client Conversation

You are not selling n8n. Never say "n8n," "workflow," or "webhook" to a client. You're selling the outcome: booked appointments, answered leads, recovered revenue.

### The demo (10 minutes, live, on their business)

Before the meeting, spend 20 minutes personalizing the demo workflow with their business name, their services, their hours. Generic demos get polite nods; personalized demos get "wait, can it really do that?"

1. **Trigger it live.** Call the demo number and let it ring out; watch the text arrive on your phone on the table between you. Or submit their contact form and show the AI reply landing in under a minute. The physical immediacy sells harder than any slide.
2. **Show the conversation, not the plumbing.** Screen-share the resulting text thread or email. Never show the n8n canvas — it looks like complexity, and complexity reads as fragility and cost.
3. **Name their number.** "How many calls a week ring out when the desk is busy? What's a new patient worth?" Let them do the multiplication out loud. Their number is always more persuasive than yours.

### Discovery questions (pick five, listen more than you talk)

1. What happens right now when someone calls and no one can answer?
2. How fast do you typically respond to a new lead or web inquiry?
3. How many no-shows do you get in a typical week, and what does one cost you?
4. What's a new customer/patient/client worth to you over a year?
5. Who on your team would use or monitor this? How comfortable are they with new tools?
6. What software runs your bookings/CRM/payments today?
7. Have you tried anything like this before? What happened?
8. If this works exactly as I've shown, what would you want to automate next?

Question 6 is your feasibility check — confirm their calendar/CRM/phone system is one the workflow integrates with *before* you quote. Question 8 tees up the expansion sale.

### Objection handling

**"Is our customer data secure?"**
"Your data stays in your own accounts — your calendar, your CRM, your phone system. The automation runs in an account you own and can revoke my access to at any time. I connect the systems; I don't warehouse your data." (This is why the client-owned n8n Cloud model from Section 3 matters — it makes this answer literally true.) Add specifics: credentials are stored encrypted in the platform, and you'll document every connection during handoff. If they're a medical practice, be straight: standard messaging workflows should avoid transmitting clinical details, and you configure messages to contain scheduling info only. Don't bluff about HIPAA; scope around it.

**"What if the AI says something wrong?"**
This is the best objection you can get, because the honest answer is a selling point: "That's exactly why I don't use free templates. This system has guardrails: the AI only answers from an approved list of your services, prices, and policies that you sign off on. If someone asks something outside that list, it doesn't improvise — it says a team member will follow up, and flags it to you. And for anything high-stakes, we can run approval mode: the AI drafts, a human taps approve." Then show the fallback firing live in your demo. Never claim the AI can't make mistakes; claim the system is designed so mistakes are contained and visible.

**"That price seems high for some texts."**
Don't defend the price; reframe the comparison. "You're not paying for texts — you're paying to stop losing the callers you already paid to generate. One recovered booking a month and this pays for itself; check the math with your own numbers." If they still balk, drop scope, not price: offer the single highest-impact workflow instead of the stack. A discounting habit will quietly kill this business; a scoping habit builds it.

**"We tried a chatbot before and it was terrible."**
"Most are. They're generic scripts bolted onto a website. This is configured on your actual services and policies, it hands off to a human the moment it's unsure, and I test it against real questions before it ever talks to a customer. I'll show you the fallback behavior right now." Then trigger it.

---

## 5. The Pricing Menu

Copy this, replace the bracketed bits, and put it in a one-page PDF with your logo. Present three tiers; most clients buy the middle one, which is why the middle one is the offer you actually want to sell.

> ### [Your Brand] Automation Services
>
> **STARTER — One System Installed — $497 one-time**
> - One automation installed and configured for your business (e.g., missed-call text-back)
> - Connected to your existing phone/calendar/CRM
> - Tested live with your team before launch
> - Quick-start guide + 30 days of fix-anything support
>
> **PROFESSIONAL — The Front Desk Stack — $1,197 one-time** ← *Most popular*
> - Three automations working together (e.g., missed-call recovery + appointment reminders + review engine)
> - AI responses customized to your services, prices, and policies — approved by you
> - Team walkthrough call + written documentation
> - 60 days of fix-anything support
>
> **CARE PLAN — Keep It Running — $97–$197/month** *(optional, added to either tier)*
> - Monitoring and error alerts — we usually fix problems before you notice them
> - Monthly performance summary (calls recovered, leads answered, reviews gathered)
> - Updates when your services, prices, or hours change
> - Priority support and small tweaks included
>
> *Setup fees are one-time. You own your accounts and your data. Cancel the Care Plan anytime.*

Pricing mechanics that matter:

- **Charge 50% upfront, 50% on go-live.** Full payment upfront is fine too; never 100% on completion.
- **Anchor the monthly plan against employee cost**, not software cost: "$97/month" versus "the front desk person who'd otherwise chase this."
- **Raise prices every three clients** until you feel real resistance. Most Vault buyers underprice by half because they're pricing their hours instead of the outcome.

---

## 6. The Delivery Checklist

Delivery discipline is what separates "guy who set up a thing once" from "the automation person we recommend to other business owners." Run this list every time.

**Phase 1 — Deploy (Day 1)**
- [ ] Create or access the client's n8n instance (client-owned account, you as invited user)
- [ ] Import the workflow; rename it with the client's business name
- [ ] Replace all placeholder values: business name, services list, hours, escalation phone/email
- [ ] Configure the AI system prompt with the client-approved facts sheet (services, prices, policies) — get written sign-off on this sheet
- [ ] Connect credentials for each integration (calendar, CRM, phone/SMS, email) — created under the *client's* accounts, not yours
- [ ] Point error-alert notifications at both you and a client contact

**Phase 2 — Test (Day 1–2)**
- [ ] Run the happy path end-to-end with real (test) data: trigger → AI response → booking/CRM entry
- [ ] Run the failure paths: unanswerable question triggers the fallback; disconnected credential triggers the alert; retry logic fires on a simulated timeout
- [ ] Send 10 realistic customer questions through any AI-facing component; review every response with the client
- [ ] Have one client staff member trigger it themselves — this catches assumptions you can't

**Phase 3 — Document & Hand Off (Day 2–3)**
- [ ] Fill in the one-page client doc: what it does, what triggers it, who to contact, how to pause it
- [ ] Record a 3–5 minute screen video walking through the system in plain language
- [ ] Confirm the client has owner access to every connected account and has stored credentials in *their* password manager, not a text you sent them
- [ ] 15-minute handoff call with whoever monitors it day to day
- [ ] Send the handoff email (below) and the final invoice
- [ ] Calendar reminder for yourself: 7-day check-in and 30-day check-in

**Handoff email template:**

> Subject: Your [system name] is live ✅
>
> Hi [Name],
>
> Your [missed-call recovery system] is now live and tested. Here's what that means:
>
> **What's running:** Every missed call to [number] now gets an automatic text within seconds, offering [booking link / callback]. Anything the system can't handle gets flagged to [staff contact].
>
> **What to expect:** You'll see [texts in your inbox / bookings on your calendar] starting today. If anything ever errors, both of us get an alert automatically — you don't need to watch it.
>
> **Attached:** a one-page guide and a short walkthrough video for your team.
>
> **If you change anything** — prices, hours, services — reply here and I'll update the system the same week [Care Plan] / send me a note and I'll quote the update [no Care Plan].
>
> I'll check in on [date, 7 days out] to review the first week's activity. Final invoice attached — thank you for trusting me with this.
>
> [Your name]

---

## 7. Maintenance Retainers

The retainer is not "insurance in case it breaks." Sold that way, it churns the first quiet month. Sold correctly, it's an ongoing service with visible monthly output.

**What to include at $97–$197/month:**

1. **Monitoring and error handling.** The Vault workflows alert on failure; you triage and fix. Most months this is minutes of work — that's margin, not guilt.
2. **The monthly report.** This is the retention engine. One short email: "This month: 23 missed calls texted back, 6 replied, 4 booked. 11 review requests sent, 5 new reviews, average 4.8★." Five numbers that re-justify the fee every thirty days. Build the report from the workflow's own logs; the Vault workflows write execution data precisely so you can do this in ten minutes.
3. **Change requests.** Prices, hours, staff, seasonal messaging — small edits included, bigger builds quoted separately. Define "small" in writing (e.g., up to 30 minutes/month) so scope can't creep silently.
4. **Platform upkeep.** API deprecations, credential re-authorizations, n8n version changes. Invisible to the client, genuinely valuable, and the honest core of the fee: things *will* drift, and you'll fix them before anyone notices.

**How to justify it in one sentence:** "The setup fee gets it built; the care plan is why it's still working — and still improving — a year from now, and you'll get a report every month showing exactly what it did."

**Operational rules:** Bill automatically (Stripe subscription — do not manually invoice $97 monthly, you will hate your life). Offer annual prepay at ~2 months off. When a client declines the retainer, fine — but put in writing that post-support-window fixes bill hourly at $100–$150. About half of decliners convert to the retainer after their first paid fix.

At 10 clients averaging $125/month, the retainer book is $15,000/year for roughly 5–8 hours of monthly work. That recurring floor is what makes month-to-month revenue survivable while you sell.

---

## 8. Scaling: One Niche, One Workflow, One Offer

The move from freelancer to product line is a subtraction, not an addition. Illustrative scenario: an operator lands a salon with the missed-call workflow, then a dentist wants a chatbot, then a realtor wants CRM sync. Three niches, three workflows, three sets of everything — every install is bespoke again, and the Vault's speed advantage evaporates.

The productized version: **one niche, one workflow stack, one price, one pipeline.**

1. **Name the offer, not the technology.** "The Front Desk Rescue for dental practices — $1,197 installed, live in one week." A named, priced, scoped offer can be referred, repeated, and eventually delegated. "Custom automation services" cannot.
2. **Let repetition compound.** Your fifth dental install reuses the fourth's facts-sheet template, test-question list, and demo assets. Delivery time drops from days to hours; the price stays the same. That widening gap is your margin, and it only appears when installs are near-identical.
3. **Build the referral loop into delivery.** At the 30-day check-in, when the report shows real numbers, ask: "Do you know one other practice owner who loses calls like you did?" Local niches are villages — dentists know dentists. Two referral asks per delivered client is the cheapest pipeline you'll ever build.
4. **Raise the price as proof accumulates.** With five installs and five monthly reports full of real recovered-booking numbers, $1,197 becomes $1,997 without changing the deliverable. Proof, not effort, moves the price.
5. **Then — only then — widen deliberately.** Once one offer runs on referrals, either add a second workflow as an upsell to existing clients (easiest revenue you'll ever earn), or clone the entire playbook into an adjacent niche (dentists → med spas is a short hop; dentists → e-commerce is not).

The endgame the Vault is built for: a specific offer, at a defensible price, delivered from templates you've installed enough times to do in an afternoon, with a retainer book that pays your baseline. Ten workflows are your inventory. The niche you pick and the discipline of the checklist are the business.

Now go book the first conversation. The demo does the rest.
