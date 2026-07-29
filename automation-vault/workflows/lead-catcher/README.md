# AI Lead Catcher (Flagship)

**File:** `lead-catcher.json` | **Trigger:** Webhook (POST) | **Nodes:** 14 functional + 4 guide notes

The AI Lead Catcher turns a raw website enquiry into a scored, booked, logged sales lead in under ten seconds. A webhook receives the form submission, an AI qualifier reads it like a seasoned SDR (budget signal, buying intent, fit) and scores it 0-100, hot and warm leads get a real appointment booked into your Google Calendar in the first open slot inside your business hours (the lead receives the invite automatically), every lead is appended to a Google Sheet with the full AI verdict, and you get an email with the score, the reasoning, the booking details and a ready-to-send reply draft. Spam, vendor pitches and recruiters are filtered to cold automatically, and every failure path degrades gracefully - if the AI call, the booking or the sheet write fails, the lead is still captured and emailed to you. No lead is ever silently dropped.

## Value: what this replaces

- **Speed-to-lead:** studies consistently show leads contacted within 5 minutes convert dramatically better than leads contacted after an hour. This replies and books instantly, 24/7 - including the 3am enquiry you would have answered at lunch the next day.
- **Manual triage:** reading, judging and prioritising 30-60 enquiries a month at 3-5 minutes each is 2-5 hours of unpaid admin. Gone.
- **Scheduling ping-pong:** the average booked call costs 3-7 back-and-forth emails (10-15 minutes each). Hot leads now arrive with a confirmed slot already on both calendars.
- **Tool stack:** replaces a Calendly seat + a Zapier plan + a lead-scoring SaaS (typically $50-150/month combined) with one workflow you own.

Net effect for a typical service business: 5-8 hours a month back, faster response than any competitor, and a clean lead ledger in Sheets for free.

## Required credentials

| Credential | Used by | Type |
|---|---|---|
| Gemini API key (or any OpenAI-compatible key) | AI Lead Qualifier | HTTP Header Auth (`Authorization: Bearer YOUR_KEY`) |
| Google Calendar | Check Calendar Availability, Book Appointment | Google Calendar OAuth2 |
| Google Sheets | Log Lead to Sheet | Google Sheets OAuth2 |
| Gmail | Notify Owner | Gmail OAuth2 |

Works with Google Gemini (the default), OpenAI, OpenRouter, Groq or any OpenAI-compatible endpoint - swap the URL and model name in the AI Lead Qualifier node.

## Setup (10 minutes)

1. In n8n go to **Workflows > Import from File** and import `lead-catcher.json`.
2. Open **AI Lead Qualifier** and create a **Header Auth** credential named `Gemini API`. Header name: `Authorization`, value: `Bearer YOUR_API_KEY`.
3. Open **Check Calendar Availability** and **Book Appointment**, attach your Google Calendar OAuth2 credential, and select your calendar in both nodes.
4. Create a Google Sheet with a tab named `Leads` and paste this exact header row into row 1 **before you run the workflow**: `Timestamp, Name, Email, Phone, Company, Message, Source, Score, Tier, Budget Signal, Intent, AI Summary, Booking Status, Meeting Time, Meeting Link`. This step is not optional: if row 1 is empty when the first lead comes through, Google Sheets auto-generates its own headers from the raw internal field names (`lead_name`, `lead_email`, etc.) instead of these labels, and every row after that is mislabeled too. Copy the spreadsheet ID from its URL into **Log Lead to Sheet**, and attach your Google Sheets credential.
5. Open **Notify Owner**, attach your Gmail credential, and replace `you@yourbusiness.com` with your address.
6. Open **Pick Open Slot** and set `SLOT_MINUTES`, `DAY_START_HOUR`, `DAY_END_HOUR` and `DAYS_AHEAD` to your business hours. Set your instance timezone in the workflow settings so slots land at the right local time.
7. (Optional) Tune the system prompt inside **AI Lead Qualifier** - tell it what a great lead looks like for YOUR business, what counts as a budget signal, and the tone of the reply draft. This prompt is the brain of the workflow.
8. Test: click **Execute workflow**, then POST to the Test webhook URL:
   `curl -X POST <test-url> -H "Content-Type: application/json" -d '{"name":"Jane Doe","email":"jane@acme.com","message":"We need help automating client onboarding. Budget is around $5k, hoping to start this month."}'`
9. Check the result: a row in the sheet, an event on the calendar, an email in your inbox, and a JSON confirmation returned to the caller.
10. Activate the workflow and point your website form (or Typeform / Framer / Webflow form webhook) at the Production URL.

## Customization ideas

- **Only auto-book hot leads:** in `Hot or Warm Lead?`, swap the boolean condition for a String comparison: left value `{{ $json.tier }}`, operation "is equal to", right value `hot`. Warm leads then get logged and emailed but not booked.
- **Auto-reply to the lead:** add a second Gmail node after `Build Lead Record` that sends the AI's `reply_draft` straight to `lead_email`.
- **Slack instead of email:** swap Notify Owner for a Slack message to your #sales channel.
- **CRM sync:** replace (or duplicate) the Sheets node with a HubSpot / Pipedrive node to create the contact and deal.
- **Enrichment:** add an HTTP Request node before the qualifier that fetches the lead's company website and feeds it into the prompt for sharper scoring.
- **SMS for hot leads:** add an IF on `tier === 'hot'` and fire a Twilio SMS to your phone so nothing waits in an inbox.
- **Smarter model:** switch `gemini-2.5-flash` to a stronger model for high-ticket or technical industries where qualification nuance pays for itself.

## Sell it as a service

Package this as an "AI Speed-to-Lead System" for local service businesses, agencies, coaches and consultancies - anyone whose enquiries currently sit in an inbox overnight. Charge $1,000-1,500 for setup (branded prompt tuning, form integration, calendar rules, a test batch of their real historical enquiries) plus $100-250/month for hosting, monitoring and prompt refinements. The pitch writes itself: one extra closed client from faster follow-up pays for the whole engagement, and the Google Sheet gives the owner a live ROI dashboard from day one.
