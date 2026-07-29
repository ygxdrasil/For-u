# START HERE
## From download to your first working workflow in about 15 minutes

Welcome to the Automation Vault. Don't browse all ten folders yet — the fastest way to get value from this purchase is to get **one** workflow running right now. This page gets you there.

We'll deploy the **AI Lead Catcher** first. It's the best starter because it has one trigger (a webhook), one AI credential, and you can test it in seconds without waiting on a schedule or connecting a full inbox.

---

## What's in the ZIP

```
/01-ai-lead-catcher/          workflow.json + SETUP-GUIDE.md
/02-ai-email-triage/          workflow.json + SETUP-GUIDE.md
/03-invoice-chaser/           ...
/04-content-repurposer/
/05-review-collector/
/06-appointment-reminder/
/07-client-onboarding/        (Full Vault)
/08-cold-outreach/            (Full Vault)
/09-weekly-client-report/     (Full Vault)
/10-lead-enricher-scorer/     (Full Vault)
/playbook/                    Sell-Automations-as-a-Service Playbook (Full Vault)
START_HERE.md                 you are here
```

Every folder is self-contained: one importable JSON, one setup guide. The guides assume nothing — follow them top to bottom.

## Before you start (2 minutes)

You need two things:

1. **A running n8n instance.** Any of these works:
   - **n8n Cloud** (easiest — free trial at n8n.io, then Starter plan is plenty)
   - **Self-hosted** (free Community Edition via Docker or npm)
   No enterprise features are required for any Vault workflow.

2. **An AI provider API key.** Every workflow ships wired to Google Gemini — get a free key in under a minute at aistudio.google.com/apikey, no card required for the free tier. Already have OpenAI or Anthropic (Claude) instead? Swapping the URL and model name in the AI node is a one-line change, covered in every setup guide.

Got both? Start the clock.

## Minute 0–2: Import the workflow

1. Open n8n and go to **Workflows**.
2. Click the **three-dot menu** (top right) → **Import from File**.
3. Select `01-ai-lead-catcher/workflow.json` from the unzipped Vault.
4. The whole workflow appears on your canvas, fully wired — nodes, connections, error handling, guardrails, everything. You never build anything from scratch.

## Minute 2–8: Connect credentials

The imported workflow will show small warning marks on nodes that need credentials. There are two kinds to set up:

1. **AI provider.** Open the AI node, create a **Header Auth** credential named `Gemini API`, and paste your API key (`Authorization: Bearer YOUR_KEY`). The node is already pointed at Gemini's endpoint and model — no other setup needed for your first run.
2. **Your Google account** — the Lead Catcher books into Google Calendar, logs to a Google Sheet, and emails you via Gmail. n8n walks you through the same Google sign-in for each of the three nodes, and the setup guide gives you the exact sheet header row to paste (one copy-paste, one minute).

That's it. Every other node is pre-configured. (Full detail, including the exact sheet layout: `SETUP-GUIDE.md` in the workflow's folder.)

## Minute 8–12: Test it

1. Click the **Webhook** trigger node and copy its **Test URL**.
2. Click **Execute Workflow** (n8n now waits for a request).
3. Send it a fake lead. Easiest way — paste this into a terminal (swap in your URL):

```bash
curl -X POST "YOUR-TEST-URL-HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Test","email":"jane@example.com","message":"Hi, do you offer monthly bookkeeping? We are a 12-person firm and need help ASAP."}'
```

No terminal handy? Paste the URL and the JSON body into any free HTTP tester (Hoppscotch or Postman) and hit send.

4. Watch the canvas light up node by node: the lead comes in, the AI qualifies it, a calendar slot gets booked, the sheet gets a row, and the alert lands in your inbox — your first qualified, booked, logged lead.

## Minute 12–15: Go live

1. Follow the short **go-live checklist** at the end of `01-ai-lead-catcher/SETUP-GUIDE.md` (switch from Test URL to Production URL, activate the workflow, point your website form or landing page at the webhook).
2. Toggle the workflow to **Active**.

You now have a production automation running. That thing you just did in fifteen minutes? Businesses pay $500–$2,000 to have it done for them.

## If something doesn't work

- **Check the setup guide first** — each one has a troubleshooting section covering the common failure points (wrong credential scope, webhook URL mix-ups, model access).
- **Red node on the canvas?** Click it — n8n shows the exact error. The guides translate the cryptic ones.
- **Still stuck?** Reply to your Gumroad receipt email with what you're seeing. Real replies, real help.

## Where to go next

**Automating your own business?** Deploy in this order — it's sequenced by fastest payoff:
1. AI Lead Catcher (done)
2. Appointment Reminder & No-Show Reducer — recovers lost revenue immediately
3. Invoice Chaser — gets you paid faster from week one
4. AI Email Triage — wins back an hour a day
5. Review Collector and Content Repurposer — compounding growth on autopilot

**Planning to sell installs to clients?** (Full Vault)
1. Get the Lead Catcher running for yourself first — it becomes your live demo.
2. Read `/playbook/` — pricing, packaging, the pitch, and the delivery checklist for turning any Vault workflow into a $500–$2,000 install.
3. Your first pitch is easier than you think: every local business with a booking calendar needs the No-Show Reducer, and every service business with an inbox full of unpaid invoices needs the Chaser.

One workflow running today beats ten workflows browsed. You've already done the hard part — now go point it at something real.
