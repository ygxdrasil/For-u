# Invoice Chaser — AI Payment Reminders

Runs every morning at 9 AM, reads your invoice list from Google Sheets, finds every unpaid invoice that has slipped past its due date, and has AI write a payment reminder matched to how late it is — friendly at 3+ days ("this probably just slipped through"), firm at 14+ days ("we need a payment date this week"), and a formal final notice at 30+ days. Each reminder is emailed from your Gmail, and the sheet is updated with the stage sent, the date, and a running chase count — so every escalation tier fires exactly once per invoice and no client ever gets spammed. If the AI call fails or returns malformed output, a built-in professional fallback template sends instead, so reminders always go out.

## Value: what this replaces

- **The awkward job nobody does**: chasing invoices by hand takes a founder or bookkeeper 2–4 hours a week of scanning aged receivables and agonizing over wording. That is 10–15 hours a month, gone.
- **Real cash-flow impact**: invoices chased consistently and on a schedule get paid dramatically faster. Pulling even one $2,000 invoice forward by three weeks pays for this vault many times over.
- **Dedicated AR software**: tools like Chaser, Upflow, or Paidnice charge $35–$150+/month for essentially this loop. This runs on your own n8n for pennies of API cost.
- **Relationship protection**: the escalation ladder means clients get a warm nudge first, not a scary demand — and the once-per-tier guard means they are never double-emailed.

## Required credentials

| Credential | Used by | Type |
|---|---|---|
| Google Sheets | Read Invoices, Update Chase Status | Google Sheets OAuth2 |
| Gmail | Send Reminder Email | Gmail OAuth2 |
| Gemini API key (or any OpenAI-compatible key) | Write Reminder Email (AI) | Generic **Header Auth** (`Authorization: Bearer YOUR_KEY`) |

Works with any OpenAI-compatible provider — OpenAI, OpenRouter, Groq, Together, or a local server. Just swap the URL and model name in the AI node.

## Setup guide

1. **Import**: in n8n, go to Workflows → Import from File → select `workflow.json`.
2. **Create the sheet**: make a Google Sheet with a tab named `Invoices` and these exact headers in row 1: `Invoice ID`, `Client Name`, `Client Email`, `Amount`, `Currency`, `Due Date`, `Status`, `Last Reminder Stage`, `Last Chased Date`, `Chase Count`. Use `YYYY-MM-DD` for due dates.
3. **Point at your sheet**: open **Read Invoices** and **Update Chase Status**, replace `YOUR_SHEET_ID` with the long ID from your sheet URL, and attach your Google Sheets OAuth2 credential to both nodes.
4. **Connect Gmail**: attach your Gmail OAuth2 credential to **Send Reminder Email**.
5. **Connect the AI**: create a credential of type Header Auth named `Gemini API` — Name: `Authorization`, Value: `Bearer YOUR_KEY` — and attach it to **Write Reminder Email (AI)**.
6. **Brand it**: open **Business Settings** and set your company name, sender name, and payment link. These flow into every email the AI writes.
7. **Customize the voice (optional)**: the escalation tone lives in the system prompt inside the AI node — edit it to match how your business talks.
8. **Test**: add a row with Status `Unpaid` and a due date 5+ days in the past, click **Execute workflow**, and confirm the email arrives and the sheet columns update.
9. **Go live**: activate the workflow. It runs daily at 9 AM (change the hour in **Daily Trigger** if you like).

## Customization ideas

- **Change the escalation thresholds**: the 3/14/30-day tiers are three lines in **Find Overdue Invoices** — some businesses prefer 7/21/45.
- **BCC yourself or your bookkeeper**: add a BCC in the Gmail node options so a human sees every chase.
- **Slack alert on final notices**: branch after **Parse AI Reply** with an IF on `stage == final` and ping a channel — final notices deserve human eyes.
- **Multi-language reminders**: add a `Language` column and pass it into the AI prompt so clients are chased in their own language.
- **Attach the invoice PDF**: pull the invoice from Google Drive by ID and attach it to the Gmail node.
- **Protect key accounts**: set Status to `Do not chase` for sensitive clients — the workflow skips them automatically.
- **Swap Gmail for Outlook/SMTP**: replace the one send node; everything upstream is provider-agnostic.

## Sell it as a service

Package this as an "Automated Receivables Follow-Up" install for agencies, consultancies, trades, and any service business that invoices on terms — the pitch writes itself: "your invoices get chased every single day, politely, without you thinking about it." Charge $500–$1,500 for setup (sheet migration, brand-voice prompt tuning, testing against their real aged receivables), plus an optional $100–$250/month for monitoring and tweaks. Anchor the price to recovered cash, not hours: one mid-sized invoice paid three weeks earlier covers the entire engagement.
