# Capital.com MCP setup

Official server: <https://github.com/capital-com-sv/capital-mcp> (their own org).
40 tools — market search, historical prices, WebSocket streaming, positions,
watchlists, trading.

> Capital.com's own mandated disclosure: **81.31% of retail investor accounts
> lose money trading CFDs with this provider.**

## 1. Get credentials (in your Capital.com account)

1. Enable **2FA** — API key generation is blocked without it.
2. Settings → **API integrations** → Generate new key.
3. Set a **custom API password**. This is separate from your login password.

Never paste these into a chat. They go in `.env` or your MCP client's config.

## 2. Install locally (persistent — recommended)

```bash
brew install uv          # or: curl -LsSf https://astral.sh/uv/install.sh | sh
git clone https://github.com/capital-com-sv/capital-mcp.git
cd capital-mcp
uv sync
```

Register with Claude Code:

```bash
claude mcp add --scope user capital \
  --env CAP_ENV=demo \
  --env CAP_API_KEY=... \
  --env CAP_IDENTIFIER=your@email \
  --env CAP_API_PASSWORD=... \
  -- uv run --directory /absolute/path/to/capital-mcp python -m capital_mcp.server
```

Or for Claude Desktop, build the bundle and double-click it:

```bash
npx @anthropic-ai/mcpb pack . capital-mcp.mcpb
```

## 3. Keep the safety defaults

From their `.env.example` — these ship correct, don't loosen them yet:

```
CAP_ENV=demo                    # demo until paper trading proves a strategy
CAP_ALLOW_TRADING=false         # read-only
CAP_MAX_OPEN_POSITIONS=3
CAP_MAX_ORDERS_PER_DAY=20
CAP_REQUIRE_EXPLICIT_CONFIRM=true
CAP_ALLOWED_EPICS=              # empty = allowlist nothing
```

Trading also enforces a two-step preview→execute flow. Leave
`CAP_ALLOW_TRADING=false` until a strategy has cleared all nine acceptance gates
*and* a paper-trading run.

## Known limits

- **Historical prices cap at 1000 bars per request.** Too thin for the 200-500
  trades across regimes the gates require — which is why crypto backtesting runs
  on Coinbase history instead, with Capital.com for index/CFD live data and
  execution.
- **CFDs mean Capital.com is your counterparty** — not an exchange.
- **ESMA leverage caps** (Sweden): 2:1 crypto, 20:1 major indices, 30:1 major FX.
- Sessions expire after 10 minutes; the server re-authenticates.
- Rate limit ~10 req/s; 1 req/0.1s for order creation.

## Swedish tax note

ISK and KF accounts **cannot hold CFDs, futures, or crypto** — so this runs
through a standard *depå*, where **every trade must be reported individually on
form K4**. Crypto losses are only 70% deductible. Factor the reporting burden
into how many trades a strategy is allowed to generate.
