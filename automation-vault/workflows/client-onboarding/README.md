# Client Onboarding Autopilot

The moment a client signs, one form submission runs your entire day-one onboarding: an AI writes a genuinely personalized welcome email (referencing their exact package, notes and preferred start date), a kickoff call is booked on your Google Calendar with the client invited, the client is appended as a new row to your master client sheet, and you receive an internal email with an AI-prioritized prep checklist and a tailored kickoff agenda. Bad submissions (missing name/email) never reach the client - they route to an alert email instead - and if the AI ever returns invalid output, a professional fallback welcome email goes out automatically, so the client never sees a broken message.

## Value: what this replaces

- **45-90 minutes of admin per new client**: writing the welcome email, finding a kickoff slot, sending the invite, updating the client tracker, and writing yourself a to-do list - all gone. At 4 new clients/month that is roughly 4-6 hours back, every month.
- **The "silent first 48 hours" problem**: new clients get a same-minute, personalized response instead of waiting for you to get around to it. Faster first touch measurably reduces early churn and buyer's remorse refunds - one saved client pays for this vault many times over.
- **Dropped-ball onboarding**: no more clients who never got a kickoff call or never made it into the tracker.

## Required credentials

| Credential | Used by |
|---|---|
| Gmail OAuth2 | Send Client Welcome Email, Send Owner Checklist Email, Alert Owner: Bad Submission |
| Google Calendar OAuth2 | Create Kickoff Calendar Event |
| Google Sheets OAuth2 | Log Client to Master Sheet |
| Gemini API key (or any OpenAI-compatible key) (Header Auth) | AI: Write Welcome Email |

## Setup guide

1. **Import** `client-onboarding.json` into n8n (Workflows > Import from File).
2. Open the **Workflow Settings** node and set `owner_email` (where alerts/checklists go), `agency_name`, `sender_name`, and `kickoff_duration_minutes`.
3. Create a **Gmail OAuth2** credential and attach it to all three Gmail nodes.
4. Create a **Google Calendar OAuth2** credential and attach it to *Create Kickoff Calendar Event* (it books on your primary calendar by default).
5. Create a Google Sheet with a tab named `Clients` and this exact header row: `Signed Date | Client Name | Email | Company | Package | Kickoff Date | Status | Notes`. Create a **Google Sheets OAuth2** credential, attach it to *Log Client to Master Sheet*, and replace `YOUR_GOOGLE_SHEET_ID` with the ID from your sheet's URL.
6. Create a **Header Auth** credential named `Gemini API` - Name: `Authorization`, Value: `Bearer YOUR_API_KEY` - and attach it to *AI: Write Welcome Email*. Any OpenAI-compatible provider works (OpenAI, OpenRouter, Groq, local): just swap the URL and `model` in that node.
7. (Optional) Edit the system prompt inside *AI: Write Welcome Email* to match your brand voice - tone, sign-off style, word count.
8. **Activate** the workflow, open *New Client Form*, copy the **Production** form URL, and submit a test using your own email as the "client".
9. Verify the four outputs: welcome email received, calendar invite received, sheet row appended, checklist email in your inbox.
10. Put the form URL where deals close: your proposal tool's post-signature redirect, contract confirmation page, or as the last step of your sales call script.

## Customization ideas

- **Slack instead of (or alongside) the owner email**: add a Slack node after *Log Client to Master Sheet* to post the checklist to a #new-clients channel.
- **Package-specific onboarding**: add a Switch node on `Package / Services Purchased` to send different AI prompts, attach different intake docs, or book with different team members.
- **Day-3 follow-up**: add a Wait node (3 days) after the checklist email, then a second AI email asking the client for logins/assets they have not sent.
- **CRM instead of Sheets**: swap the Sheets node for HubSpot/Pipedrive/Airtable - the parsed client object has everything mapped and ready.
- **Contract-triggered**: replace the Form Trigger with a webhook from PandaDoc/DocuSign/Stripe so signing (or paying) fires the autopilot with zero manual input.

## Sell it as a service

Package this as a "Client Onboarding System" install for agencies, consultants, law firms, or MSPs: a 60-minute discovery call, branded prompt + email customization, credential hookup, and a live test with their next real client. Charge $750-$1,200 flat for the install (it demos brilliantly - submit the form live on the sales call and watch the email, invite and sheet row appear), plus an optional $100-$150/month "automation care" retainer for hosting, monitoring and tweaks. The buyer's math is easy: it pays for itself with the first client who onboards while they sleep.
