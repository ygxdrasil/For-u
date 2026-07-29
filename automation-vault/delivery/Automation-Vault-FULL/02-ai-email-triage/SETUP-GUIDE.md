# AI Email Triage & Draft Replies

Every new email that hits your Gmail inbox is picked up within a minute, cleaned, and sent to an AI that classifies it as a **sales lead**, **support** request, **urgent** issue, or **spam**. For anything worth answering, the AI writes a complete, on-tone reply that lands in your Gmail **Drafts** folder attached to the original thread - ready for you to review, tweak, and send in one click. The thread is auto-labeled with its category so your inbox self-organizes, and anything flagged urgent fires an instant alert email (send it to your phone's SMS gateway or a Slack channel address) with a one-line summary, the reason it's urgent, and a direct link to the thread. Nothing is ever auto-sent: a human approves every reply.

## Value: what this replaces

- **Inbox triage time.** At 50 inbound emails a day, a human spends 60-90 minutes just reading, sorting, and deciding what matters. This does it in the background, 24/7 - that's 25-35 hours a month back.
- **First-draft writing.** The slowest part of email is the blank page. Reviewing and sending a good draft takes ~20 seconds vs 3-5 minutes writing from scratch. At a modest $30/hour, the combined saving is $900+/month per inbox.
- **Missed urgent emails.** One angry client or outage email buried for 6 hours can cost more than this whole vault. The urgent-alert path is effectively a paging system for your inbox.
- **Tool stack.** Replaces an email triage SaaS ($10-30/mo) plus a VA doing first drafts ($300+/mo). Running cost is roughly **$0.01 per 100 emails** with gemini-2.5-flash.

## Required credentials

- **Gmail OAuth2** (n8n "Gmail OAuth2 API" credential) - used by *Gmail Trigger*, *Create Draft Reply*, *Label Thread*, and *Send Urgent Alert*.
- **Gemini API key (or any OpenAI-compatible key)** - a generic **Header Auth** credential on *AI Triage & Draft*. Ships wired to Google Gemini by default; also works with OpenAI, OpenRouter, Groq, or any OpenAI-compatible endpoint (including local servers).

No other services are needed - no sheets, no databases.

## Setup (10 minutes)

1. **Import the workflow.** In n8n: *Workflows > Import from File* > select `workflow.json`.
2. **Create the Gmail credential.** In Google Cloud Console: create a project, enable the **Gmail API**, configure the OAuth consent screen, create an OAuth client ID, then paste the client ID and secret into a new **Gmail OAuth2** credential in n8n and sign in.
3. **Attach Gmail everywhere.** Open *Gmail Trigger*, *Create Draft Reply*, *Label Thread*, and *Send Urgent Alert* and select that credential in each.
4. **Create the AI credential.** Open *AI Triage & Draft* > create a new **Header Auth** credential named `Gemini API` with Name `Authorization` and Value `Bearer YOUR_API_KEY`.
5. **Create four Gmail labels** in Gmail itself: `AI/Sales Lead`, `AI/Support`, `AI/Urgent`, `AI/Spam`.
6. **Paste the label IDs.** Open *Label Thread*, temporarily switch the *Label Names or IDs* field to the dropdown to see each label's ID (`Label_123...`), copy the four IDs into `LABEL_MAP` at the top of the *Parse AI Response* code node, then restore the field's expression: `{{ [ $('Parse AI Response').item.json.labelId ] }}`.
7. **Set your alert address.** In *Send Urgent Alert*, replace `YOUR_ALERT_EMAIL@example.com` with your own address (or a carrier email-to-SMS address / Slack channel email).
8. **Personalize the AI (optional but worth it).** In *AI Triage & Draft*, add your company name, what you sell, pricing page URL, and support SLA to the system prompt - drafts get dramatically better with context.
9. **Test.** Send yourself an email that sounds urgent ("Our checkout is down, we need help today"), click *Execute Workflow*, then confirm: a draft in Drafts, a label on the thread, an alert in your inbox.
10. **Activate** the workflow. It polls every minute from now on.

## Customization ideas

- **Auto-send low-risk replies.** Once you trust the drafts, add an IF on `confidence > 0.9` for the `support` category and swap draft creation for a real send.
- **CRM logging.** Append every `sales_lead` to Google Sheets or your CRM with sender, summary, and confidence - instant lead register.
- **VIP list.** In *Parse AI Response*, force `isUrgent = true` when `fromEmail` matches your top clients' domains.
- **Different alert channel.** Replace *Send Urgent Alert* with a Slack, Telegram, or Twilio node.
- **More categories.** Add `billing`, `partnership`, or `press` to the prompt, `ALLOWED` list, and `LABEL_MAP` - the routing logic doesn't change.
- **Cheaper/faster models.** Point the HTTP node at OpenRouter or Groq and swap the model name - the credential setup already supports it.

## Sell it as a service

Package this as an "AI Inbox Manager" install for founders, agencies, law firms, e-commerce stores, and property managers - anyone drowning in email where a missed message costs money. Charge **$500-$1,000 for setup** (credential wiring, label taxonomy, and a custom-tuned system prompt with the client's voice and offers), plus **$50-150/month** for monitoring and prompt refinement. One client demo - showing a real inquiry turning into a polished draft in under a minute - usually closes it.
