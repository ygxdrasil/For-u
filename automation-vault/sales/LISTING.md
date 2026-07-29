# The Automation Vault
## 10 production-grade n8n workflows, pulled from real client systems. Import them today. Bill for them this month.

You don't need another prompt pack. You need automations that actually run — and a way to get paid for installing them.

---

## The problem

Somewhere right now, a small business owner is copy-pasting leads from a contact form into a spreadsheet. Chasing an unpaid invoice by hand for the third time. Losing a booking to a no-show because nobody sent a reminder. Rewriting the same "thanks for reaching out" email for the fortieth time this week.

They would pay real money to make that stop. You know n8n exists. You may have even opened it.

And then you hit the wall everyone hits: the blank canvas. Or worse — you bought one of those $10 "500 automation templates" dumps and discovered what's actually inside: half-wired nodes, dead credentials, no instructions, workflows that were clearly never run by anyone, ever. That's not inventory. That's homework.

**The Automation Vault is the shortcut past all of that.**

## What's inside

Ten complete n8n workflow JSONs. Each one imports in a single click and ships with a plain-English setup guide covering credentials, node configuration, and a go-live checklist. No guessing, no reverse-engineering someone else's spaghetti.

1. **AI Lead Catcher** — catches inbound enquiries from a webhook, qualifies them with AI, and gets a response out while the lead is still warm.
2. **AI Email Triage & Draft Replies** — watches Gmail, sorts what matters from what doesn't, and drafts replies for you to approve instead of write.
3. **Invoice Chaser** — runs daily and politely, persistently chases overdue invoices so the awkward money conversation happens without you.
4. **Content Repurposer** — feed it one blog post or newsletter and get a stack of platform-ready content out the other side.
5. **Review & Testimonial Collector** — automatically asks happy customers for reviews on a schedule, so social proof compounds while you sleep.
6. **Appointment Reminder & No-Show Reducer** — hourly reminder sweeps that turn "sorry, I forgot" into a booked chair, a full calendar, and kept revenue.
7. **Client Onboarding Autopilot** — a new client signs, and the welcome email, kickoff tasks, and folder setup all happen without you touching anything.
8. **Cold Outreach Personalizer** — reads a lead list from Google Sheets and writes a genuinely personal first line for every single prospect.
9. **Weekly Client Report Generator** — every Friday, a clean progress report lands in your client's inbox and quietly justifies your retainer.
10. **Lead Enricher & Scorer** — takes a bare email and domain, enriches it into a full profile, and scores it so you call the hot ones first.

Workflows 1–6 are in the Core Vault. All 10 — plus the Agency Playbook — are in the Full Vault.

## Who this is for

- **Freelancers and agency owners** who want to add "automation setup" as a $500–$2,000 productized service — without spending three months learning to build from scratch.
- **Solopreneurs and small business owners** who are done being their own admin department and want leads, invoices, reviews, and reminders handled automatically.
- **VAs, OBMs, and ops people** who want to walk into their next client conversation with deployable systems instead of promises.
- **n8n tinkerers** who can build workflows but want to see how production systems handle errors, retries, and AI guardrails — because that's the part no tutorial teaches.

You do not need to be a developer. If you can follow a recipe, you can deploy these.

## Built from a real deployed system

The flagship Lead Catcher isn't theory: it's the generalized version of a real AI booking agent I built and deployed — one that qualifies enquiries, books real calendar appointments, logs every lead, and survived a 16-scenario stress battery (prompt-injection attacks, broken multilingual input, hallucinated dates, troll submissions) before a clean, generic version went into the Vault. The other nine workflows are built on the exact same hardened patterns. (No client data is included anywhere.)

That origin matters, because deployment teaches you things a tutorial never will:

- **Retry and backoff logic is already wired in.** APIs fail. Rate limits happen. These workflows expect that and recover, instead of silently dying at 2 a.m.
- **Error handling that tells you what broke.** Failure paths route somewhere useful instead of vanishing.
- **Anti-hallucination guardrails on every AI step.** Constrained outputs, validation checks, and human-approval gates where it counts — because an AI that invents an invoice amount or promises a refund isn't an automation, it's a liability.

This is the difference between a workflow that demos well and a workflow you can bill a client for and then sleep at night.

## Why this isn't another prompt pack or template dump

| | Prompt packs | $10 template dumps | The Automation Vault |
|---|---|---|---|
| What you get | Words to paste into ChatGPT | Hundreds of half-wired JSONs | 10 complete, hardened systems |
| Engineering quality | N/A | Half-wired, never tested | Validated structure, hardened patterns from a real deployment |
| Setup instructions | None | None | Per-workflow guide, assumes nothing |
| Error handling | N/A | Rarely | Retries, backoff, failure routing built in |
| AI guardrails | You're on your own | No | Wired into every AI workflow |
| Time to first working workflow | — | Days of debugging | Hours (often under one) |
| Path to revenue | None | None | Sell-It-as-a-Service Playbook included |

Prompt packs sell you inspiration. Template dumps sell you someone else's unfinished homework. The Vault sells you inventory — assets you can deploy, resell, and build a service business on.

## Choose your tier

| | **Core Vault — $27** | **Full Vault + Agency Playbook — $47** |
|---|---|---|
| Workflow JSONs | 6 | All 10 |
| AI Lead Catcher | Yes | Yes |
| AI Email Triage & Draft Replies | Yes | Yes |
| Invoice Chaser | Yes | Yes |
| Content Repurposer | Yes | Yes |
| Review & Testimonial Collector | Yes | Yes |
| Appointment Reminder & No-Show Reducer | Yes | Yes |
| Client Onboarding Autopilot | — | Yes |
| Cold Outreach Personalizer | — | Yes |
| Weekly Client Report Generator | — | Yes |
| Lead Enricher & Scorer | — | Yes |
| Per-workflow setup guides | Yes | Yes |
| Sell-Automations-as-a-Service Playbook | — | Yes |
| Best for | Automating your own business | Selling installs to clients at $500–$2,000 each |

**Core Vault ($27)** covers the four things every small business bleeds time on: leads, inbox, cash flow, and follow-up. If you're automating your own operation, start here.

**Full Vault ($47)** is the agency kit. Four more client-facing workflows — onboarding, outreach, reporting, and lead scoring — plus the Sell-Automations-as-a-Service Playbook: how to package these as done-for-you installs, what to charge ($500–$2,000 per install is the going market range for automations like these), how to pitch without sounding like a bot, and how to turn one install into a monthly retainer. One client install at even the low end of that range pays for the Vault ten times over.

## FAQ

**Do I need to know how to code?**
No. Every workflow imports into n8n with one click, and the setup guides walk you through credentials and configuration in plain English — connect account, paste key, flip toggle. If you can set up a Zapier zap, you're overqualified. A few workflows contain small code nodes, but they're pre-written and you never need to touch them.

**Which n8n plan do I need?**
Any of them. These workflows run on n8n's free self-hosted Community Edition and on every n8n Cloud tier, including Starter. No enterprise features are required. If you're not sure where to start, the Quick Start guide includes a recommendation.

**Which AI provider do the AI workflows use?**
Every workflow ships wired to Google Gemini by default, because Gemini's free tier is generous enough that most solo users never pay a cent to run these. But the AI steps are deliberately provider-agnostic: they call a standard OpenAI-compatible chat endpoint over HTTP, so switching to OpenAI, OpenRouter, Groq, or a local model via Ollama is a one-line URL + model change described in every setup guide. No vendor lock-in. You bring your own API key; typical usage costs are pennies per run even on paid providers.

**Do I get updates?**
Yes. When workflows are updated — for n8n version changes, node deprecations, or improvements — you re-download the latest files from your Gumroad library at no extra charge. Updates to the edition you purchased are free for life.

**What if it's not for me?**
30-day money-back guarantee, no hoops. If you import the workflows, follow the guides, and decide the Vault isn't what you needed, reply to your receipt email within 30 days and you'll get a full refund.

**Can I resell these to clients? What does the license allow?**
Deploying these for paying clients is the entire point — the Full Vault exists to help you charge $500–$2,000 per install. Your license covers unlimited installs for your own business and for as many clients as you can land. What you can't do is resell or redistribute the Vault itself: no sharing the JSON files or guides, no bundling them into your own template product, no "here's the folder" handoffs. Sell the service, not the files.

## License terms

**You may:**
- Import and run all workflows for your own business, on any number of n8n instances you control.
- Deploy, configure, and customize any workflow for clients as a paid service, with no per-client fees and no install limits.
- Modify, extend, and combine the workflows however you like for your own or your clients' use.

**You may not:**
- Resell, redistribute, share, or give away the workflow JSON files, setup guides, or Playbook, in whole or in part, modified or not.
- Include the files in any product, template library, course, community vault, or bundle — free or paid.
- Claim authorship of the original workflows for the purpose of reselling them as templates.

One license per person. Plain version: use them everywhere, sell the outcome to anyone, never sell the files.

---

**Stop buying inspiration. Buy inventory.**

Pick your tier above — ten minutes from now you can have your first workflow imported, and the only question left is which client to install it for first.
