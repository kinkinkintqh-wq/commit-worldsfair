# Three-minute product demo

This is separate from the founder presentation. The UI is English, and all sample balances are identified as simulation unless Devnet receipts have been produced.

## Before recording

- Run `npm run build` and `npm start`; open `http://127.0.0.1:4317`.
- Use a clean browser profile/session for a $10 sample balance, or explain existing orders honestly. Do not delete runtime state to reset a funded Devnet order.
- Keep the browser width around 1280px; hide unrelated tabs/notifications.
- Default task: `Solana USDC payments`, 3 units × 0.05 = 0.15. Use the first available future window.
- For a 3-minute recording, use simulation and its explicitly marked clock step. For Devnet, pre-book/fund, wait for the real window, and clearly distinguish the prerecorded deposit from execution shown later.
- Never paste an old Commit transaction into a new order as evidence.

## Shot list and English narration

| Time | Action | Voiceover |
| --- | --- | --- |
| 00:00–00:15 | Home hero | “Commit lets an agent agree on future service capacity, its price, time window and delivery criteria before the work begins. This is our independent World’s Fair prototype.” |
| 00:15–00:40 | Reserve capacity; show future window and query | “I need three retrieval calls in this future window. The service has declared capacity. I request a fixed-price quote for fifteen cents. Notice that a quote does not lock quota.” |
| 00:40–01:00 | Confirm reservation; fund simulated escrow | “Confirmation reserves the provider’s declared quota. Funding is a separate step. This recording uses clearly labeled simulated funds. The Devnet adapter instead validates an exact Circle USDC transfer to a unique project-operated vault.” |
| 01:00–01:10 | Start booked window (demo clock) | “I advance only the simulation clock. In Devnet, execution waits for the real booked time.” |
| 01:10–01:35 | Execute and show output | “The provider performs retrieval over a fixed public-source corpus. Here are the returned contents and citations. This is computed output, not a fake LLM response or a pasted transaction.” |
| 01:35–01:55 | Verify then settle | “The verifier checks quantity, latency, sources, integrity and the booked window. All checks pass. Settlement pays fifteen cents to the provider and leaves zero in escrow.” |
| 01:55–02:25 | Create second order; fund; open window; select Provider unavailable; execute | “Now consider the other outcome. The provider is unavailable in this controlled simulation. A reservation should still tell the buyer what happens next.” |
| 02:25–02:45 | Verify and refund | “Delivery fails the agreed checks. The provider receives zero, and the buyer gets the full fifteen cents back. Failure is retained in the order’s evidence.” |
| 02:45–03:00 | Evidence and Developers | “Each run keeps its terms, output, verification and settlement together. Provider and verifier are currently project-operated; external pilots and PDA custody are next. Commit makes tomorrow’s agent service a clear commitment today.” |

## Expected ledger outcomes

| Run | Starting balance | Escrow | Provider payment | Buyer refund | Ending balance |
| --- | ---: | ---: | ---: | ---: | ---: |
| Successful order | 10.00 | 0.15 | 0.15 | 0.00 | 9.85 |
| Failed order after success | 9.85 | 0.15 | 0.00 | 0.15 | 9.85 |

`npm run demo` also executes successful, unavailable, late and missing-citation scenarios and writes `qa/demo-evidence.json`. These are application validation runs, not user traction or blockchain receipts.

## Recording acceptance

Keep both videos within the official limits. Presentation: two to three minutes. Product demo: no more than three minutes. A screen recording is not completed merely by supplying a script; the final checklist retains recording/upload as user actions. If narration timing runs long, cut provider-desk footage before removing the refund or trust disclosure.
