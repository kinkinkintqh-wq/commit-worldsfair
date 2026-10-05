# Commit — Forward Market for Agent Capacity

**Tomorrow’s capacity. Committed today.**

Reserve a future service window at a fixed price, fund the order, execute inside that window, verify the delivery criteria, then settle or refund. This independent Crypto World’s Fair edition foregrounds capacity, price, time and SLA rather than service discovery.

## Run in two minutes

Requires Node.js 24+. This repository uses a different port and state directory from the earlier Commit project.

```sh
npm ci --ignore-scripts
npm run build
npm start
```

Open **http://127.0.0.1:4317**. Default mode is an interactive **simulation**: no wallet, API key or blockchain funding is needed. Each browser session receives a simulated $10 balance. No existing Commit API is called.

```sh
npm test          # state, money, HTTP isolation and Solana transaction tests
npm run demo     # four actual new-code runs; writes qa/demo-evidence.json
npm run doctor   # independent configuration and build check
```

## What is implemented

| Layer | Running behavior |
| --- | --- |
| Product | Home, capacity desk, commitments, provider desk and developer view; responsive English UI |
| Quote | Immutable time, quantity, price and SLA; quote expiry; quotes do not lock supply |
| Reserve | Atomic overlap-aware inventory admission; repeated confirmation returns the same order |
| Escrow | Simulation ledger or a distinct Solana Devnet USDC custody address for each reservation |
| Execute | Funded orders only; booked time window enforced; actual deterministic retrieval over a fixed corpus |
| Verify | Quantity, observed latency, content, declared-source membership, integrity and time-window checks |
| Settle / Refund | Full provider payout after passing all checks; full buyer refund after failure or no-show |
| Evidence | Terms hash, output hash, linked events and money trail for one reservation; JSON export |
| Isolation | Own Git history, namespaced environment, own `.state/`, port 4317; no old deployment target |

The provider and verifier are project-operated. The demo is **not a live LLM, an open provider network, a GPU reservation system or independent semantic verification**. Units are repeated retrieval executions for the quoted query, not distinct research topics.

## Solana + USDC integration

The Devnet adapter builds and validates SPL `TransferChecked` deposits, binds reservation terms through transaction memos, and pays the provider or refunds the original buyer. It checks the official Devnet genesis hash, the official Circle test USDC mint, buyer signature, exact amount, destination and net token balance. Signed payouts are persisted before broadcast, and retries reuse their transaction signature.

**Custody is controlled by this project’s server keys. No custom escrow program has been deployed; this is not trustless custody.** All keys are freshly generated inside this repo and are excluded from Git. No mainnet mode exists.

On 5 October 2026, live Solana Devnet testing confirmed buyer-signed deposits, a verified provider payout, and a separate full no-show refund, each for 0.15 Circle test USDC. Official Devnet RPC independently confirmed transaction success, amounts, mint and recipients. See [receipt verification](evidence/verification.zh-CN.md) and the exported evidence records. These are controlled prototype tests, not customer traction or revenue.

To run the live test path:

```sh
npm run devnet:setup -- --airdrop
cp .env.example .env
```

In this new `.env`, set `COMMIT_WF_MODE=devnet` and `COMMIT_WF_STATE=.state/devnet.sqlite`. Fund the printed operator address with Devnet SOL. Use a separate buyer test wallet with Devnet SOL and **Circle Devnet USDC** from [Circle’s faucet](https://faucet.circle.com/). Start the app, connect the buyer wallet, make a reservation, deposit, wait for the real booked window, execute, verify and settle. There is no clock advancement or injected failure in Devnet. A query with no corpus matches can demonstrate a genuine failed delivery check and refund.

See [Devnet instructions](docs/devnet.md) before signing. Circle test USDC has no financial value; do not send mainnet USDC or SOL here.

## Demo

Default task: `Solana USDC payments`, three retrieval units, $0.05 each, total $0.15. Response SLA: 1.5 seconds for the batch and at least one recognized source per unit. Available declared quota: 32 unfulfilled units for overlapping windows. See [demo runbook](docs/demo-runbook.md).

In simulation, use “Start booked window (demo clock)” to avoid waiting. Run one successful order and one “Provider unavailable” order. Their final receipts respectively show $0.15 provider payment and $0.15 buyer refund. Simulation events are explicitly marked; no fake transaction signatures are generated.

## Delivery map

| File | Purpose |
| --- | --- |
| `docs/START-HERE.zh-CN.md` | Chinese handoff, actual completion status and minimum remaining steps |
| `docs/product-ux.md` | Information architecture, UX rules and service terms |
| `docs/architecture.md` | State machine, trust boundaries, storage and Solana integration |
| `docs/devnet.md` | Fresh-wallet setup, faucet funding and receipt verification |
| `docs/demo-runbook.md` | Three-minute walkthrough, success and refund paths |
| `docs/deployment.md` | Independent deployment preparation only |
| `submission/pitch-3min.md` | English founder pitch, approximately three minutes |
| `submission/pitch-short.md` | English 30–60 second version |
| `submission/project-application.md` | Name, problem, insight, market, GTM, validation, team and disclosure |
| `submission/checklist.md` | Submission readiness and owner actions |
| `qa/verification.md` | Checks actually completed and boundaries |

## Development history and founder

Founder: **Hoikin, Hong Kong, solo**. The founder confirmed no real customers, revenue, external pilots or financing. Earlier Commit work explored future reservations and fulfillment on an earlier testnet. This edition reuses the product logic, warm paper/cobalt visual language and one existing illustration; its code is newly implemented in a separate repository. Do not describe the company or concept as having begun from zero during this hackathon. See [development disclosure](submission/project-application.md).

## Competition sources

[Crypto World’s Fair](https://colosseum.com/worldsfair) lists a 12 October 2026 submission date. The [official rules](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf) specify 23:59 Pacific Time, equivalent to **13 October 2026, 14:59 in Hong Kong/Shanghai**. Aim to finish on 11 October. The [submission guidance](https://colosseum.com/hackathon) asks for an English presentation, a product-demo video and repository access; check the live portal for final fields.

## Operating boundary

This version is a single-instance prototype with no mainnet or production authorization. Do not put it on the existing `commit.jibai.site`, reuse old secrets or install it into a judging project’s directory. The deployment files are preparation, not a deployment. The local Git repository has no inherited remote. This dedicated repository is published for judges. Competition registration and final submission are performed by the founder. Existing projects and deployments are untouched.


## Submission videos
[Project presentation](https://kinkinkintqh-wq.github.io/commit-worldsfair/videos/pitch.html) · [Product demonstration](https://kinkinkintqh-wq.github.io/commit-worldsfair/videos/demo.html) Product walkthrough captures are labeled simulation; live Devnet transfer receipts are provided separately.
