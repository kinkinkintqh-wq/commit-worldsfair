# Product and UX

## Positioning

Commit is an **Agent Capacity Reservation Layer**, with the long-term direction “Forward Market for Agent Capacity.” It sells an agreement about future participating-provider capacity. It does not sell a speculative financial instrument, tokenize GPU ownership or offer a secondary trading market in this prototype.

Buyer job: “My workflow will need a service at a specified time. Agree on the available quantity, price and delivery criteria now, with a clear outcome if the provider fails.”

Provider job: “Declare future supply, accept only the quantity I can fulfill, and compare delivered results with my promise.” The provider desk is currently read-only and project-operated, not self-service onboarding.

## Information architecture

| View / hash route | Primary task | Evidence shown |
| --- | --- | --- |
| `#home` | Understand the future-reservation value | Product claim and scope disclosure |
| `#reserve` | Select window, quantity, query; review quote | Available quota, fixed price, expiry and SLA |
| `#record/:id` | Complete one reservation | Fund, execute, verify, settle/refund and the same-run event chain |
| `#commitments` | Find previous orders in this session | Status, window, amount and task |
| `#supply` | Review declared supply and sample outcomes | Available windows, session payouts and refunds |
| `#developers` | Understand integration and trust | API stages, custody, provider and verifier limits |

## Key UX decisions

- Product first: time, units, price and delivery terms precede token mint, hashes or wallet details.
- Quote is visually “capacity not locked”; confirmation is the lock step. Funding is separate.
- Each order presents one next action. Execution is unavailable before escrow and before the booked window.
- Simulation labels stay visible on every view. The simulated clock changes only an order’s demo timeline.
- Successful service output and verification checks appear before the money receipt. A hash alone is not a deliverable.
- Failed delivery gets “Refund due,” not a green success label. The final buyer/provider amounts are explicit.
- Source links point to the declared corpus; fixed-source retrieval is never described as a live web or LLM answer.
- The footer and developer view explain project-operated custody and verification.
- Mobile layout becomes one column; navigation stays visible; controls have labels and keyboard focus indicators.

## Executable service specification

| Term | Prototype value |
| --- | --- |
| Service | `search.v1`, repeated deterministic retrieval for a quoted query |
| Supply | 32 unfulfilled retrieval units across overlapping reserved windows |
| Order | 1–20 units, default 3 |
| Time | Future 10-minute window; Devnet lead time at least 90 seconds |
| Price | 50,000 six-decimal units per retrieval = 0.05 simulated USD / Devnet USDC |
| Quote validity | Up to 90 seconds, never beyond window start |
| SLA | Whole batch ≤1,500 ms observed response; all units have content and ≥1 recognized citation; delivery ends inside the window |
| Payment | Full escrow upfront, all-or-nothing order settlement |
| Failure | Any delivery check fails: full refund; no provider payment |
| No-show | After window end, unused funded escrow can be refunded |
| Reservation scope | Admission against declared local quota; no upstream hardware allocation |

The price is demonstration data, not validated willingness to pay. Completion releases outstanding quota; it is not a permanent daily allocation. The prototype does not implement provider bonds, transferable reservations, partial settlement, cancellation fees, external providers or autonomous scheduling. An agent can call the HTTP stages, but the demo uses explicit user actions for clarity.

## Visual language

Warm paper `#F5F3ED`, ink `#202624`, secondary `#62665F`, cobalt `#315BD6`, fine rules `#D2D4CC`. Georgia headings with system sans-serif body; restrained borders and 4–6px button corners. Existing Commit illustration copied as a new file; original untouched. No invented transaction badges, customer logos or reliability scores.

## Acceptance examples

1. Two buyers quote 20 units each against 32 available. The first confirms; the second is rejected at reserve, because quote is not an inventory lock.
2. A buyer reserves three units for 0.15. Successful verified output pays 0.15 to the provider, with zero escrow remaining.
3. A response misses its deadline. Verification fails; the buyer receives 0.15 back; the failed checks remain visible.
4. An interrupted process does not silently claim delivery. Recovery marks the attempt failed so the funded order can be verified and refunded.
