# Cold Outreach Personalizer

Reads your lead list (Name, Company, Website) from Google Sheets, visits each company's homepage, extracts the real text (title, meta description, body copy), and has AI write a genuinely specific 2-sentence opener that references what the company actually does — no invented facts, no "I noticed" cliches. The opener, a one-line company summary, and a status flag are written back to the sheet, ready to drop into your sending tool. Rows are processed one at a time with polite pacing, dead or JS-only sites get flagged as SKIPPED instead of crashing the run, and only rows with an empty Opener are ever touched, so re-runs are completely safe.

## Value: what this replaces

Manually researching a company and writing a decent first line takes 3-4 minutes per lead. On a 500-lead list that is 25-30 hours of SDR or VA time — roughly $375-$750 at VA rates, $1,500+ at SDR loaded cost — versus about $0.50 of API spend and zero human minutes with this workflow. It also replaces a seat on personalization tools like Clay or Smartwriter ($97-$349/month) for this specific job, and because openers reference real homepage content, reply rates typically land 2-3x higher than template blasts.

## Required credentials

- **Google Sheets OAuth2** — attached to both Google Sheets nodes (read leads, write openers).
- **Gemini API key (or any OpenAI-compatible key)** — a Header Auth credential named `Gemini API` (Name: `Authorization`, Value: `Bearer YOUR_KEY`), attached to the "AI: Write Personalized Opener" node. Ships wired to Google Gemini by default; also works with OpenAI, OpenRouter, Groq, or any local OpenAI-compatible endpoint.

No Gmail or Calendar credentials are needed — this workflow deliberately stops at "openers ready in the sheet" so you keep full control of sending.

## Setup guide

1. In n8n, go to **Workflows > Import from File** and import `outreach-personalizer.json`.
2. Create a Google Sheet with a tab named **Leads** and these exact headers in row 1: `Name | Company | Website | Opener | Status | Summary`.
3. Open **Get Leads From Sheet** and **Save Opener To Sheet**, attach your Google Sheets OAuth2 credential to both, and paste your Sheet ID (the long string in the sheet URL) into *Document ID* on both nodes.
4. Create a **Header Auth** credential named `Gemini API` — Name: `Authorization`, Value: `Bearer sk-YOUR_KEY` — and attach it to **AI: Write Personalized Opener**.
5. Add 2-3 test leads to the sheet. Website can be plain like `acme.com` (the workflow adds `https://` automatically). Leave the Opener column empty.
6. Click **Execute workflow** and confirm openers, summaries, and READY statuses appear in the sheet.
7. Open the AI node and customize the system prompt: your tone, extra banned phrases, and what sentence 2 should bridge toward (your actual offer category).
8. Optionally adjust the schedule trigger (default: daily at 08:00) and the 2-second pacing Wait node.
9. Toggle the workflow **Active**. Each run only processes rows with an empty Opener, so you can keep appending leads to the sheet forever.

## Customization ideas

- Swap provider or model: change the URL and `model` in the AI node body (OpenRouter, Groq, a local model — anything OpenAI-compatible).
- Add a second AI call that writes a matching subject line into another column.
- Chain a Gmail node after the sheet update to auto-create drafts from READY rows.
- Also fetch `/about` or `/blog` and append it to the extracted text for deeper personalization.
- Replace the schedule trigger with a webhook so your CRM pushes new leads in real time.
- Add a language field per lead and instruct the prompt to write the opener in that language.
- Tighten or loosen the 45-word cap and the banned-phrase list to match your sending style.

## Sell it as a service

Package this as an "AI personalization engine" for lead-gen agencies, recruiters, or any team sending cold email at volume: the client only ever touches a Google Sheet, which makes delivery and handoff trivial. Charge $500-$1,500 for setup (sheet provisioning, prompt tuning to their offer, a 100-lead calibration batch) plus $200-$500/month for hosting, monitoring, and prompt iteration. At 2,000 leads/month you are replacing roughly $1,000+ of VA work for pennies of API cost — an easy ROI story to close on.
