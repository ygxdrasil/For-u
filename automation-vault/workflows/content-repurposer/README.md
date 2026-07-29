# Content Repurposer — Blog to LinkedIn, X & Instagram

Send one long-form piece (blog post, newsletter, essay) to a webhook and get back three platform-native social assets — a LinkedIn post, a 5-9 tweet X thread, and an Instagram caption — all written in the original author's voice, never generic marketing copy. Every run is appended as a row to a Google Sheets content queue marked `Ready for review`, and if the payload includes an email address, a formatted copy of all three assets lands in your inbox via Gmail. Bad input (empty or too-short content) and malformed AI output are caught and returned as clean JSON errors instead of silent failures.

## Value: what this replaces

- A freelance social media repurposing service runs $500-2,000/month per client for exactly this deliverable.
- Manually repurposing one article into three platform formats takes a decent writer 60-90 minutes. At 8 articles/month that is 8-12 hours saved — every month, per client.
- Cost to run: roughly $0.01-0.03 per article with gemini-2.5-flash. A month of heavy use costs less than one coffee.

## Required credentials

- **Gemini API key (or any OpenAI-compatible key)** — as an n8n *Header Auth* credential (`Authorization: Bearer YOUR_KEY`). Ships wired to Google Gemini by default; also works with OpenAI, OpenRouter, Groq, or any OpenAI-compatible endpoint.
- **Google Sheets OAuth2** — for the content queue.
- **Gmail OAuth2** — optional, only needed if you want the email copy.

## Setup guide

1. In n8n: **File > Import from File** and select `content-repurposer.json`.
2. Create a Google Sheet with these headers in row 1, exactly:
   `Date | Source Title | LinkedIn Post | X Thread | Instagram Caption | Voice Summary | Status`
3. Open the **Save to Content Queue** node, attach your Google Sheets OAuth2 credential, and replace `YOUR_SHEET_ID` with the ID from your sheet URL (the long string between `/d/` and `/edit`). Confirm the tab name matches (`Sheet1` by default).
4. Open **Generate Social Posts (AI)** and attach a new **Header Auth** credential named `Gemini API` — Name: `Authorization`, Value: `Bearer YOUR_API_KEY`. To use OpenRouter/Groq/local, change only the URL in this node.
5. (Optional) Open **Email the Results** and attach your Gmail OAuth2 credential. If you skip email entirely, the workflow still runs — the branch is skipped automatically when no `email` is in the payload.
6. (Optional) Customize the system prompt inside **Generate Social Posts (AI)**: post length, tweet count, hashtag rules, house tone. Keep the voice-matching and no-fabrication guardrails.
7. **Activate** the workflow and copy the Production URL from the **Content Webhook** node.
8. Test:
   ```bash
   curl -X POST YOUR_WEBHOOK_URL \
     -H "Content-Type: application/json" \
     -d '{"title":"My post","email":"you@example.com","content":"<paste 200+ characters of a real article>"}'
   ```
9. Verify: the webhook responds with all three assets as JSON, a new row appears in the sheet, and (if you sent `email`) a formatted email arrives.

## Customization ideas

- **Form front-end**: swap the Webhook for an n8n Form Trigger so non-technical clients can paste articles into a hosted form.
- **URL input**: add an HTTP Request node before Normalize Input that fetches a blog URL and strips HTML, so clients submit links instead of raw text.
- **More formats**: extend the AI prompt and sheet columns with a YouTube Shorts script, Facebook post, or email teaser.
- **Auto-publish**: read rows with `Status = Approved` on a Schedule Trigger and push them to Buffer/Metricool/LinkedIn API.
- **Brand voice presets**: store per-client voice guidelines in a second sheet tab and inject them into the system prompt.
- **Slack review**: replace/augment the Gmail step with a Slack message to a #content-review channel.

## Sell it as a service

Package this as a "Content Multiplication Engine" for coaches, agencies, and newsletter operators: they send one article, their entire week of social content appears in a shared review sheet. Charge $500-1,000 for setup (branded prompt tuning, sheet design, form front-end) plus $99-299/month for hosting, monitoring, and prompt refinements. Positioned against the $1,500+/month human repurposing services it replaces, it sells itself on one screenshot of the content queue.
