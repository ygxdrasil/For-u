# Appointment Reminder & No-Show Reducer

An hourly n8n workflow that reads your Google Calendar, finds every appointment starting roughly 24 hours and 2 hours from now, and emails each guest a short, AI-personalized reminder written by GPT-4o-mini (day-before confirmation at 24h, action-focused "see you soon" nudge at 2h). Every send is logged to a Google Sheet with a `eventId|email|reminderType` dedupe key, so no guest ever gets the same reminder twice — even if you re-run the workflow manually. Cancelled events, declined guests, meeting-room resources, and the organizer are automatically skipped, and if the AI ever returns malformed JSON the workflow falls back to a clean built-in template so the reminder still goes out.

## Value: what this replaces

- Replaces a front-desk person spending 30–60 minutes a day manually confirming tomorrow's appointments — roughly 15–20 hours/month of admin time.
- Replaces SMS/email reminder SaaS (Appointment Reminder, GReminders, Apptoto and similar) that runs $30–150/month, with copy that's actually personalized instead of a mail-merge blast.
- Industry data consistently shows reminder sequences cut no-shows by 25–40%. For a clinic, salon, or consultancy billing $100+/appointment with even 10 no-shows a month, that's $250–400/month recovered — from a workflow that costs pennies in API calls.
- The Google Sheet doubles as a permanent audit trail: proof of exactly who was reminded, when, and with what subject line.

## Required credentials

- **Google Calendar OAuth2** — `Fetch Upcoming Events` node
- **Gmail OAuth2** — `Send Reminder Email` node
- **Google Sheets OAuth2** — `Fetch Sent Log` and `Log Reminder Sent` nodes
- **Gemini API key (or any OpenAI-compatible key)** — `AI: Personalize Reminder` node, as a generic **Header Auth** credential (Name: `Authorization`, Value: `Bearer YOUR_KEY`). Ships wired to Google Gemini by default; also works with OpenAI, OpenRouter, Groq, or any local OpenAI-compatible endpoint — just swap the URL and model name in the node.

## Setup (10 minutes)

1. In n8n: **Workflows → Import from File** → select `workflow.json`.
2. Create a Google Sheet. Rename the first tab to `ReminderLog` and add these headers in row 1: `dedupe_key | event_id | event_title | attendee_email | reminder_type | event_start | sent_at | subject`.
3. Copy the Sheet ID from the sheet's URL (the long string between `/d/` and `/edit`) and paste it into **both** Google Sheets nodes, replacing `YOUR_SHEET_ID`.
4. Attach your Google Calendar OAuth2 credential to `Fetch Upcoming Events` and pick the calendar to watch (defaults to your primary calendar).
5. Attach your Google Sheets OAuth2 credential to `Fetch Sent Log` and `Log Reminder Sent`, and your Gmail OAuth2 credential to `Send Reminder Email`.
6. Create a **Header Auth** credential named `Gemini API` (Name: `Authorization`, Value: `Bearer sk-...`) and attach it to `AI: Personalize Reminder`.
7. Optional: open `AI: Personalize Reminder` and tweak the system prompt — business name, tone, language, cancellation policy line.
8. Test: create a calendar event starting ~2 hours from now with your own email as a guest, click **Execute workflow**, and confirm you receive the email and a new row appears in the sheet.
9. Run it a second time — nothing should send. That's the dedupe log doing its job.
10. Toggle the workflow **Active**. It now runs every hour on its own.

## Customization ideas

- **Change the windows**: edit the two `hoursUntil` checks in `Build Reminder Queue` (e.g. 48h + 4h for consultancies) and widen `timeMax` in `Fetch Upcoming Events` to match.
- **Filter by event type**: add a keyword check in `Build Reminder Queue` (e.g. only events whose title contains "Consult") so internal meetings never trigger reminders.
- **Add SMS**: branch after `Parse AI Response` into a Twilio/HTTP node for a text-message nudge alongside the email.
- **Confirm/reschedule links**: have the AI prompt include your Calendly or booking-page link so guests can one-click reschedule instead of ghosting.
- **Multi-language**: add a rule to the system prompt to write in the language of the event description, or hardcode your market's language.
- **No-show tracking**: add a `showed_up` column to the sheet and you have an instant no-show analytics dataset per client, per service, per time slot.

## Sell it as a service

Package this as a "No-Show Recovery System" for clinics, med spas, salons, law firms, tutors, and consultants — anyone who bills by the appointment. Pitch the math, not the tech: "you lose $X per empty slot; this recovers most of them automatically and gives you a full audit log." Charge $500–1,000 for setup and customization (branded copy, timing tuned to their booking flow) plus $100–250/month for monitoring and tweaks; a client recovering even three appointments a month is profitable, which makes the retainer an easy yes.
