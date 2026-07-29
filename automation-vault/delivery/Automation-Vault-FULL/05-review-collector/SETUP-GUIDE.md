# Review & Testimonial Collector

Turns finished jobs into 5-star reviews on autopilot — and intercepts unhappy customers before they vent in public. Every morning at 9 AM it reads your `Jobs` sheet, finds jobs completed 3+ days ago that haven't been asked yet, and sends each customer a personalized, AI-written "how did we do?" email (referencing their exact job and technician). Their reply lands on a webhook, where a second AI classifies the sentiment: clearly happy customers automatically get a warm follow-up with your public Google review link (quoting their own best line back to them), while negative or lukewarm feedback is logged and emailed privately to the owner with a one-line summary and a suggested next step. Every reply is stamped into a `Feedback` tab, and every job row is marked so nobody is ever asked twice.

## Value: what this replaces

- Replaces the "I'll text them later" review chase that never happens — a business doing 40 jobs/month spends 3-5 hours/month on manual follow-up, and most owners simply skip it.
- Review-request SaaS tools (NiceJob, Podium, Birdeye) charge $75-$400/month for essentially this loop. This runs on your n8n for pennies of API cost.
- The sentiment gate is the real money: one intercepted 1-star review protects a rating that drives local search ranking. Going from 4.2 to 4.7 stars measurably lifts call volume for local service businesses.
- Fail-safe by design: unparseable AI output routes to the owner, never to the customer; missing emails and blank form spam are filtered before they touch your sheet.

## Required credentials

| Credential | Used by | Notes |
|---|---|---|
| Google Sheets (OAuth2) | Read Completed Jobs, Mark Review Requested, Log Feedback | Read/write access to one spreadsheet |
| Gmail (OAuth2) | Send Review Request, Send Public Review Ask, Alert Owner Privately | Sends as the connected account |
| Gemini API key (or any OpenAI-compatible key) | AI: Write Review Request, AI: Sentiment Sort | Header Auth credential: `Authorization: Bearer YOUR_KEY`. Ships wired to Google Gemini by default; also works with OpenAI, OpenRouter, Groq, or any local OpenAI-compatible endpoint (swap URL + model in the two AI nodes) |

## Setup guide

1. **Import** the workflow: n8n → Workflows → Import from File → `workflow.json`.
2. **Create the Google Sheet** with two tabs. `Jobs` headers: `Job ID | Customer Name | Email | Job Type | Completion Date | Technician | Status | Review Requested`. `Feedback` headers: `Date | Name | Email | Rating | Message | Sentiment | Confidence | Summary | Testimonial Quote | Routed To`.
3. **Attach credentials**: your Google Sheets credential to the 3 Sheets nodes, your Gmail credential to the 3 email nodes.
4. **Set the Sheet ID**: replace `YOUR_GOOGLE_SHEET_ID` in all 3 Sheets nodes (it's the long ID in the spreadsheet URL).
5. **Create the AI credential**: n8n → Credentials → New → Header Auth, name it `Gemini API`, Name = `Authorization`, Value = `Bearer sk-...`. Attach to both AI nodes.
6. **Edit the CONFIG blocks** at the top of the `Find Jobs Due` and `Normalize Reply` code nodes: business name, owner name, owner alert email, public review link (your Google Business "write a review" URL), your feedback form URL, and the days-to-wait / max-age windows.
7. **Wire your feedback form**: point any form tool (Tally, Fillout, a website form) at `https://YOUR-N8N-URL/webhook/review-feedback`, POSTing `name`, `email`, `rating` (1-5), `message`. The email's feedback link should open that form.
8. **Customize the AI prompts** (optional): open the two AI nodes and adjust tone rules — keep the strict-JSON output instructions intact, the downstream parse nodes depend on them (with safe fallbacks either way).
9. **Test the outbound flow**: add a `Jobs` row with Status = `completed` and a Completion Date 3+ days ago, then execute the workflow manually from the schedule trigger. Check the email and the `Review Requested` stamp.
10. **Test the inbound flow** with the curl command on the webhook sticky note (try rating 5 with glowing text, then rating 1 with a complaint), then **Activate** the workflow.

## Customization ideas

- Change the ask timing: `DAYS_AFTER_COMPLETION` per job type (same-day for emergency work, 7 days for renovations).
- Add an SMS channel: duplicate the send branch with Twilio via HTTP Request for customers with phone numbers but no email.
- Push testimonial quotes to marketing: append `Testimonial Quote` rows to a separate "Wall of Love" sheet or post to Slack.
- Second-touch nudge: add a follow-up branch that re-asks (once) if no feedback arrived within 7 days of the first email.
- Multi-location: add a `Location` column and route the public review link per branch in the CONFIG.
- Swap Google review link for Yelp, Trustpilot, or an industry directory — it's one config line.

## Sell it as a service

Package this as a "Reputation Engine" for local service businesses (HVAC, plumbing, detailing, med spas, contractors): you host the n8n instance, connect their Gmail and job sheet (or wire it to their FSM/CRM export), brand the email copy, and hand them a monthly report from the Feedback tab. Charge $500-$1,000 for setup plus $100-$250/month management — an easy sell against Podium/Birdeye pricing, and one prevented bad review or a handful of new 5-stars pays for the year. Upsell path: connect the testimonial quotes to their website or social posting for another $300 setup.
