# Colosseum application content — English draft

Updated 5 October 2026. These are ready-to-use content blocks, not a claim that the authenticated portal has been filled or submitted. Match any live field limits when pasting. Links to a new public/private review repository, demo deployment and recorded videos must be inserted after those assets exist.

## Product name

Commit

## Tagline

Tomorrow’s capacity. Committed today.

## One-line description

Commit is an agent capacity reservation layer: agree on future service quantity, price, time and SLA, then verify delivery before settling or refunding.

## Short project description

Commit turns future agent-service demand into an explicit reservation. A buyer requests a quote with a future window, quantity, price and delivery criteria. Confirmation locks a participating provider’s declared quota; escrow funds the order. Execution inside the booked window produces a deliverable that is checked against the agreed terms. Verified delivery pays the provider; failed delivery returns the full payment to the buyer. This independent World’s Fair prototype includes an interactive simulation and a Solana Devnet Circle-USDC integration. The provider, verifier and custody are currently project-operated. It does not claim an open provider marketplace or trustless SLA enforcement.

## Problem

An agent workflow may need a service later, rather than immediately. A service listing and payment method do not by themselves specify whether the provider will accept a future workload, what quantity is committed, what price applies or how a missed delivery is handled. Buyers need terms they can plan around; providers need a way to avoid accepting more outstanding work than their declared quota and to review delivery against their promise. Commit focuses on the future agreement and its eventual outcome.

## Founder insight

The idea arose from Hoikin’s experience operating an ASP service. The founder encountered the practical difference between listing a service and consistently delivering it, including in his own service. This led to the question: can tomorrow’s service window and delivery terms be agreed today? The hypothesis is that future reservations will be useful for agent workflows with recurring tasks and real deadlines. Founder experience motivates that hypothesis; it does not yet establish customer willingness to pay.

## Solution and product

Commit provides Quote → Reserve → Escrow → Execute → Verify → Settle / Refund. The quote pins the service, quantity, time window, price and delivery criteria. Reservation uses an atomic, overlap-aware ledger so non-locking quotes cannot oversell the declared quota. The prototype’s retrieval provider returns cited content from a fixed corpus; verification checks delivery shape, quantity, observed latency, source membership, integrity and window completion. A same-run record links the terms, result, checks and money trail.

The current service is intentionally narrow: measurable retrieval delivery, not arbitrary agent reasoning or universal quality arbitration. “Forward market” describes the direction toward booking future services, not a shipped derivatives exchange, transferable contract or hardware-backed futures product.

## Why blockchain / why Solana

The reservation agreement needs a payment outcome that buyers and providers can inspect. The Devnet adapter uses SPL-token transfers and transaction memos to link deposits and payouts to an order’s terms hash. Circle test USDC gives the prototype a familiar six-decimal payment unit. Solana is the selected ecosystem for this independent edition. In this implementation the application still controls the custody keys and verification decision; the blockchain records token movement, not proof of off-chain service quality. A reviewed PDA custody program and a clearer verifier-authority model are roadmap items.

## Integrated chains and tools

- Solana Devnet only; official genesis hash is checked.
- Circle-issued Solana Devnet USDC; fixed official mint and 6-decimal precision.
- `@solana/web3.js` and `@solana/spl-token` for transaction construction, receipt checking and payouts.
- Node.js HTTP API, SQLite atomic quota/accounting ledger, esbuild and a responsive English web UI.
- A Solana wallet extension signs buyer transactions. New server-side test keys control independent vaults and payout fees.
- No existing Commit API, earlier contract, wallet, database or deployment is used by this version.

## Target customer and initial use case

Initial target: developers and operators of repeated agent workflows that depend on a participating retrieval/data service at a known future time. Examples include scheduled reporting and data-enrichment tasks. These are target segments to test, not existing customers.

Initial supplier: a retrieval or data provider willing to declare future quota and accept explicit delivery criteria. The first usable protocol must fit the supplier’s actual admission controls; a database reservation alone does not lock an upstream GPU or API account.

## Market opportunity

The relevant initial market is the intersection of repeated agent workflows, services that can express future quota, and buyers who value a delivery commitment. Commit does not yet have evidence for a credible top-down TAM figure, and does not use the entire AI or crypto market as its addressable market.

The market thesis will be tested from the bottom up: count qualified workflows, reservation frequency, order value, supplier participation and repeat demand. A durable opportunity would require buyers to prefer an advance agreement over ordinary on-demand calls, and providers to accept enough economically meaningful bookings to support distribution and settlement costs.

## Business model hypothesis

Potential pricing: a fee on successfully fulfilled reservations and/or provider software for capacity planning and fulfillment review. The current prototype charges no platform fee; $0.05 per retrieval unit is demo pricing, not a validated price point. The first pilot should compare buyer willingness to pay for a reservation with supplier willingness to pay for order management. No revenue forecast is presented as traction.

## Alternatives and differentiation

Payment protocols transport value; service directories help discovery; ordinary retry/queue logic helps an immediate request. A reservation system adds application-specific agreement about future quantity, price, time and delivery criteria. Those primitives can be composed rather than replaced. Commit’s differentiation hypothesis is the explicit future-capacity commitment and the single record from quote through outcome, rather than a claim that competitors cannot implement reservations.

## Go-to-market

1. Interview 10 qualified workflow operators and 5 service providers about a concrete scheduled task. Ask whether on-demand service is already sufficient, how they define a missed delivery and who would pay for an advance reservation.
2. Recruit up to two external retrieval/data providers for a controlled pilot. Define a measurable service contract and confirm the provider genuinely accepts a quota commitment.
3. Complete 10 real pilot bookings across at least three independent buyers. Measure acceptance, delivery against SLA, refunds, repeat bookings and provider feedback. These are future targets, not current results.
4. Publish an adapter specification and a truthful case study only after participant approval. Use provider relationships and workflow integrations as initial distribution rather than building a broad service catalog.
5. Continue only if there is repeated demand and suppliers can honor bookings. Otherwise narrow the use case or prioritize capacity-management software.

## Traction / validation — current facts

Commit is a founder-built prototype. Hoikin has confirmed there are **no real customers, revenue, external pilots or financing**. There are no external-provider commitments or letters of intent to report.

Technical validation includes a working simulation of the full reservation-to-outcome flow, controlled failure/refund scenarios, atomic inventory admission, hash-linked evidence and automated tests of state transitions, conservation, session isolation and Solana deposit/payout handling. The official live Devnet network and Circle-USDC mint have been verified. The operator and separate buyer wallet have been funded on Devnet and their balances were checked. The separate buyer has signed a confirmed 0.15 Devnet USDC deposit for reservation r_ca2255f9-1455-412a-a5f1-e04dd3c40056. A second order completed all six delivery checks and paid 0.15 test USDC to the provider; a separate expired order fully refunded 0.15 test USDC to the buyer. All transfers were independently checked on official Devnet RPC. Automated transaction fixtures are not customer validation or a live-chain deployment.

## Team and founder-market fit

Hoikin is a solo founder based in Hong Kong. The project originated from hands-on experience operating an ASP service and observing the need to connect future delivery promises with execution records. This independent version is developed with AI-assisted coding. There are no teammates to list. Educational credentials, employment history, prior exits and production-scale operating achievements are not asserted without evidence.

## What was built for this edition

A new repository and application: English information architecture, capacity desk, atomic admission ledger, explicit state machine, simulation and Devnet adapters, fresh per-reservation custody wallets, buyer signing flow, exact-deposit verification, persisted payout outbox, output and SLA checks, full/refund money trail, independent configuration, automated checks, demonstration data and submission materials.

## Relevant prior development disclosure

Commit existed as an earlier project exploring future ASP reservations and fulfillment records, with an earlier testnet prototype and project-operated providers/verifier. It was submitted to a separate competition, whose code and deployment are frozen for judging and have not been modified here.

This edition reuses the concept, reservation/fulfillment logic, visual direction and one earlier Commit illustration. Its code and environment are newly implemented in an independent repository on 4 October 2026. The prior public repository is `https://github.com/kin684660-commits/commit-capacity`; it was read as a reference only. Do not claim that the whole concept or all prior development began during Crypto World’s Fair. If the portal requests an exact breakdown against the 14 September competition start, supply the dated prior commit history rather than assuming dates from this narrative.

## Milestones after submission

First: capture independent Devnet success and refund receipts. Second: external demand interviews and a genuine provider-quota pilot. Third: review provider-signed offers, PDA custody and verifier authority after the workflow terms are validated. Mainnet custody and production deployment are not immediate commitments.

## Links to insert when available

- New repository: not yet published; local isolated Git repository is ready.
- Independent demo URL: not yet deployed; local preview is available.
- Presentation video: script supplied; recording/upload remains.
- Product-demo video: narrated simulation video with subtitles and background music prepared; upload remains.
- New Devnet evidence: buyer-signed 0.15 USDC deposit confirmed; live success settlement and separate full refund independently verified.

## Optional accelerator questions

Full-time commitment, ability to spend 12 weeks in San Francisco, incorporation details and any other personal declarations must be answered by Hoikin. They are not inferred from a prototype or from the absence of financing.
