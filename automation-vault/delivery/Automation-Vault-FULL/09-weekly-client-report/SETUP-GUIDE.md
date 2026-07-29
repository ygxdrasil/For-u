# Weekly Client Report Generator

Every Friday at 3 PM, this workflow pulls the week's metric rows from a Google Sheet, has AI write a professional plain-language client report — wins, the numbers with context, and next week's focus — then emails it to your client as a polished, branded HTML email and archives the full report text back to the sheet. Metrics older than 7 days are filtered out automatically, so your team just appends rows all week and the report takes care of itself. If a week has no data, the client is never emailed a hollow report; instead you get an internal alert so you can fix the sheet and re-run.

## Value: what this replaces

The Friday afternoon ritual every agency knows: an account manager spending 45-90 minutes per client digging through numbers, writing a status email, and formatting it nicely. At 5 clients, that's 4-7 hours of senior time every single week — roughly $300-700/week in labor, or $15k-35k/year — replaced by a workflow that runs in seconds and never skips a Friday. It also creates a permanent, auditable archive of every report ever sent, which pays for itself the first time a renewal or dispute conversation happens.

## Required credentials

- **Google Sheets OAuth2** — read the Metrics tab, append to the Report Archive tab (2 nodes)
- **Gmail OAuth2** — send the client report and the internal no-data alert (2 nodes)
- **Gemini API key (or any OpenAI-compatible key)** — added as an n8n *Header Auth* credential (`Authorization: Bearer YOUR_KEY`); works with OpenAI, OpenRouter, Groq, or any local OpenAI-compatible endpoint

## Setup guide

1. **Import** `workflow.json` into n8n (Workflows → Import from File).
2. **Create the Google Sheet** with two tabs:
   - `Metrics` with header columns: `Date`, `Metric`, `Value`, `Notes`
   - `Report Archive` with header columns: `Sent At`, `Week Of`, `Subject`, `Report Text`, `Status`
3. **Open the "Workflow Config" node** and set `clientName`, `clientEmail`, `agencyName`, and `alertEmail` (your own inbox — this is where the no-data alert goes).
4. **Attach your Google Sheets OAuth2 credential** to "Get This Week's Metrics" and "Archive Report to Sheet", and replace `YOUR_SHEET_ID` in both with the long ID from your sheet's URL.
5. **Attach your Gmail OAuth2 credential** to "Email Report to Client" and "Send No-Data Alert".
6. **Create a Header Auth credential** named `Gemini API` (Name: `Authorization`, Value: `Bearer sk-...`) and attach it to "AI Report Writer".
7. **Customize the AI prompt** (optional but recommended): open "AI Report Writer" and tune the system prompt inside `jsonBody` for this client's tone — more formal for enterprise, mention their industry, forbid emoji, etc. Keep the guardrails (never invent numbers, honest about bad weeks).
8. **Test:** add 4-6 sample rows to the Metrics tab dated within the last 7 days, click **Execute workflow**, and check the email arrives and an archive row appears. Point `clientEmail` at yourself for the test.
9. **Test the empty path:** temporarily date all rows 2+ weeks back, execute again, and confirm you get the internal alert instead of a client email.
10. **Activate** the workflow. It fires every Friday at 3 PM — change day/time in the "Every Friday 3 PM" schedule trigger to suit each client.

## Customization ideas

- **One copy per client** — duplicate the workflow, change only the Config node and sheet ID; each client can get their own tone, send time, and language.
- **Auto-feed the Metrics tab** — point other vault workflows (or Zapier/Make/native integrations) at the sheet so ad spend, leads, and traffic rows append themselves daily.
- **CC the account manager** — add a `ccList` field in Config and set it in the Gmail node's options.
- **Monthly rollup** — clone it, change the trigger to the 1st of the month and the lookback window in "Summarize the Week" from 7 to 30 days.
- **Slack instead of (or alongside) email** — branch after "Build & Format Report" and post `reportText` to a shared client channel.
- **Swap the model** — `gemini-2.5-flash` keeps costs near-zero (well under $0.01 per report); switch the URL/model in one node to use OpenRouter, Groq, or a local model.

## Sell it as a service

Package this as "automated weekly client reporting" for agencies, freelancers, and fractional operators — the pitch writes itself: *your clients hear from you every Friday, in plain English, without anyone spending their afternoon on it.* Charge $500-1,000 for setup (sheet structure, tone-tuning the prompt per client, connecting their Google/Gmail accounts) plus $50-150/month per client for hosting and prompt upkeep. A buyer who deploys this for just five clients at the low end has turned a $57 vault into $2,500 in setup fees and recurring revenue on top.
