# AI Lead Catcher — n8n workflow source

Backup/reference copies of the n8n workflows behind the "AI Lead Catcher" system: an AI
receptionist that answers inbound booking/enquiry chats in under a minute, qualifies the
lead, checks calendar availability, books the appointment, logs the lead, and emails the
business owner. Sold as a white-label monthly service to small businesses.

These files are exported **source**, not a deployable app — the live system runs on n8n
cloud (`hamza2.app.n8n.cloud`), using Google Gemini 2.5 Flash, Google Calendar, Gmail, and
n8n Data Tables for lead storage. Re-importing a file into n8n reproduces the workflow, but
credentials (Gemini/Calendar/Gmail) and the referenced Data Table IDs must be re-created or
re-pointed per environment.

## Workflows

| File | Business | Vertical | Language |
|---|---|---|---|
| `salon-lumiere.json` | Lumière Hair & Beauty | Salon | English |
| `hotel-coral-bay.json` | Coral Bay Boutique Hotel | Hotel | English |
| `dental-brightsmile.json` | BrightSmile Dental Studio | Dental clinic | English |
| `real-estate-sofia-reyes.json` | Sofia Reyes / Coastal Living Realty | Real estate | English |
| `salong-solsken-swedish-demo.json` | Salong Solsken (fictional) | Salon | Swedish |

Every workflow shares the same architecture:

- **Trigger** — `@n8n/n8n-nodes-langchain.chatTrigger` (public chat webhook)
- **Brain** — `@n8n/n8n-nodes-langchain.agent` (Gemini 2.5 Flash) with a system prompt
  tailored to the business: real services/prices, hours, staff, tone, and a strict
  "never invent, never leak internal reasoning, reply in the customer's language" contract
- **Tools** — Check Availability / Book Appointment (Google Calendar), Log Lead (n8n Data
  Table, upsert-by-contact-info to dedupe), Notify (Gmail)
- **Memory** — buffer window (20 messages) for multi-turn context

### Reliability patterns baked into every prompt
- Logs the lead the moment name + contact are known — never waits for a full booking
- If a tool call fails, never mentions "technical problems"; just promises a human follow-up
  and still logs the lead (graceful degradation)
- Injects the live date/time into the prompt so the agent never hallucinates a past year
- Output discipline: replies only in-character, never narrates internal tool-call reasoning
- Refuses prompt-injection attempts (fake system overrides, "give me a free service", etc.)
- Dental variant additionally refuses to diagnose or recommend medication — always defers
  clinical questions to the in-person dentist

Hardened via a 16-scenario adversarial test pass across all four English verticals (trolling,
prompt injection, broken English, and clean bookings) — all 16 passed.

## Related, not included here

- **Landing page**: the Swedish demo is embedded (via `@n8n/chat`) on a branded page hosted
  separately at `salong-solsken.lovable.app` — the page itself lives in the Lovable project,
  not this repo.
- **Data Tables**: each business has its own n8n Data Table for captured leads (e.g.
  `Lumière Hair & Beauty — Leads`, `Coral Bay Boutique Hotel — Reservations`); table schemas
  are visible in each workflow's `Log Lead` node but the tables themselves are n8n-cloud
  resources, not exported here.
- **Fortnox pipeline**: an unrelated, pre-existing invoice-automation pipeline on the same
  n8n instance. It was used only as read-only inspiration for reliability patterns and was
  never modified.
