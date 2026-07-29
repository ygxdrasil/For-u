# Lead Enricher & Scorer

Every new lead that hits your webhook gets researched and graded before a human ever looks at it. The workflow receives a lead (email + company domain), fetches the company's homepage, has AI extract what the company does, how big it looks, and how well it fits your ideal customer profile, then scores it 1-10 with written reasoning. The enriched lead lands as a full row in Google Sheets, and anything scoring 8+ fires an instant Gmail alert to your sales inbox so hot leads get a reply while they are still warm. Invalid payloads are rejected with a clean HTTP 400, dead websites are handled gracefully (scored low-confidence instead of crashing), and malformed AI output is caught and defaulted safely.

## Value: what this replaces

Manual lead research: 5-10 minutes per lead of googling the company, skimming their site, and guessing fit. At 200 leads/month that is 16-33 hours of SDR time (roughly $400-1,200/month at typical rates) - or a paid enrichment tool subscription at $99-500/month. This does it in ~15 seconds per lead for fractions of a cent in API cost, and it never forgets to log the lead or flag the hot one.

## Required credentials

- **Gemini API key (or any OpenAI-compatible key)** - added as an n8n *Header Auth* credential named `Gemini API` (Name: `Authorization`, Value: `Bearer YOUR_KEY`). Ships wired to Google Gemini by default; also works with OpenAI, OpenRouter, Groq, or any local OpenAI-compatible server.
- **Google Sheets OAuth2** - for the enriched-lead log.
- **Gmail OAuth2** - for the hot-lead alert email.

## Setup guide

1. In n8n: **File > Import from File** and select `workflow.json`.
2. Create the three credentials above (Credentials > Add credential). For the AI key choose the generic **Header Auth** type.
3. Create a Google Sheet with a tab named `Leads` and this exact header row: `Timestamp | Email | Name | Domain | Source | Company Summary | Industry | Company Size | Size Signals | Buying Signals | Fit Assessment | Score | Score Reasoning`.
4. Open the **Save Enriched Lead** node: paste your Sheet ID (the long string in the sheet's URL) and attach the Google Sheets credential.
5. Open the **Send Hot Lead Alert** node: change `sendTo` to your sales inbox and attach the Gmail credential.
6. Open the **AI: Enrich & Score Lead** node: attach the `Gemini API` credential, then edit the **IDEAL CUSTOMER PROFILE** block in the system prompt to describe who you actually sell to - this is what makes the score yours.
7. Activate the workflow and copy the **Production** webhook URL from the New Lead Webhook node.
8. Test it:
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H 'Content-Type: application/json' \
     -d '{"email":"jane@stripe.com","company_domain":"stripe.com","name":"Jane Doe","source":"pricing page form"}'
   ```
9. Check the sheet for the new enriched row, then point your website form, Typeform, or CRM webhook at the URL.

Accepted payload fields: `email` (required), `company_domain` / `domain` / `website` (optional - derived from a work email if missing), `name`, `source`.

## Customization ideas

- **Alert channel**: swap the Gmail node for Slack, or add a Google Calendar node that books a follow-up task for 8+ scores.
- **Threshold**: the `Hot Lead? (Score 8+)` IF node holds the cutoff - drop it to 7 for more alerts, raise it to 9 for only the very best.
- **Deeper enrichment**: add a second HTTP fetch of `/about` or `/pricing` and append it to the page text before the AI call.
- **CRM sync**: replace (or duplicate) the Sheets node with HubSpot/Pipedrive/Airtable so scores land directly on the contact record.
- **Model swap**: point the AI node at OpenRouter or Groq and change the `model` field - the prompt is provider-agnostic.
- **Auto-reply**: add a Gmail node on the 8+ branch that sends the lead a personalized first-touch email drafted from `company_summary`.

## Sell it as a service

Package this as "AI lead qualification" for any client running lead forms: install it against their form, tune the ICP prompt to their business in a 30-minute call, and connect their sheet and inbox. Charge $500-1,000 for setup plus $100-200/month for monitoring and prompt tuning - the pitch writes itself the first time their sales team replies to a scored-9 lead in five minutes instead of finding it in a spreadsheet on Friday. For clients with higher volume, upsell the CRM-sync variant at $1,200-1,500.
