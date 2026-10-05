# Verification record — 4 October 2026

## Outcome

**30 automated tests passed; 0 failed.** Native frontend build passed. Four new-code simulation runs completed: one provider settlement and three full refunds. Browser walkthroughs confirmed successful settlement and a provider-failure refund. Desktop and 390px mobile home/refund layouts were inspected; no page-level horizontal overflow was observed. Screenshot files are actual captures of this isolated local app.

## What the checks establish

| Area | Verified result |
| --- | --- |
| Inventory | Quotes do not lock; confirmation deducts quota atomically; competing reservations cannot oversell an overlapping window |
| Quote / ownership | Expired quotes rejected; repeated reserve returns same order; another session cannot access an order |
| State | No execution before funding/window; no settlement before verification; no-show refundable after end |
| Conservation | Success pays exactly 0.15; failure/late/missing-citation refunds exactly 0.15; repeat actions do not duplicate balances |
| Failure truth | Empty failed delivery does not report content, source or delivery-SLA checks as passing |
| Recovery | Interrupted execution becomes failed output; unknown/expired payout is frozen rather than paid again |
| Integrity | Terms and output digests checked; event hashes link in order; mutated output fails |
| HTTP | HttpOnly session ownership, CSRF/origin guards and static-file restrictions exercised end to end |
| Devnet controls | Mainnet/wrong mint/custom RPC rejected; no real-time fast-forward/fault-injection; deposit signature cannot be reused |
| Solana fixtures | Canonical mint/amount/memo transaction built; wrong mint, amount, signer, memo, delta and failed receipts rejected |
| Payout fixtures | Confirmed retry returns existing signature without sending; failed/processed receipt never labeled settled |
| Build | Browser bundle built with esbuild; actual desktop/mobile screens rendered |

Transaction-fixture tests use structured confirmed-transaction data and stubbed RPC responses. They verify parser/control behavior, **not live network transaction completion**. The HTTP test uses only a temporary local listener and in-memory state.

## Live Devnet read

Official RPC returned genesis hash `EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG`. Circle mint `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU` was fetched and verified as 6-decimal SPL USDC. Fresh independent operator/provider public addresses were created. Operator SOL was **0**. Public airdrop was rate-limited.

Not completed: funded live USDC deposit, provider payout, buyer refund or a deployed custom program. No receipt or transaction hash was invented. See `docs/devnet.md` for the exact remaining rehearsal.

## Browser evidence

- `home-desktop.png`: independent homepage and positioning.
- `success-desktop.png`: completed successful order, provider payment 0.15, refund 0, escrow 0.
- `refund-desktop.png`: completed failure/refund, provider 0, buyer refund 0.15, escrow 0.
- `home-mobile.png`, `refund-mobile.png`: 390px responsive checks, temporary viewport restored afterward.
- `demo-evidence.json`: four reproducible engine runs with same-run terms, outputs, checks and final ledgers. These are simulated application results, not external traction.

## Isolation audit

- New repository root and branch are separate from all earlier projects.
- No inherited Git remote; no old repository push, branch update, deployment, domain/DNS operation or competition submission.
- Runtime code in `server/`, `web/` and `scripts/` contains no old Commit endpoint, earlier-chain target or deployment call.
- All private keys/database/cache files live in ignored `.state/`; `.env` is ignored.
- Original copied illustration and the new copy match SHA256 `7c62f5271b76c80b111678bef5f28c2b3c49ef9033d0851951ec0ba822a120d0`.
- Existing GitHub code was accessed with read-only search/fetch tools. Only new code/asset copies were written.

## Remaining limits

No container build or cloud deployment was tested because Docker is not installed. No presentation/demo video was recorded or uploaded. No GitHub remote repository was published and no submission portal was completed. No independent demand/provider validation exists. These gaps are explicitly retained in the checklist and application drafts.


## Latest live verification — 5 October 2026
Independent Devnet rehearsal confirmed buyer-signed deposits, provider payout and a separate full no-show refund, each for0.15Circle test USDC. See `evidence/` for checked receipts. Historical funding/setup instructions above are for reproducing with fresh wallets, not an unresolved gap. No market validation is claimed.


## Publication copy verification — 5 October 2026
All19runtime, browser, build/setup and test source files match the previously tested isolated prototype byte for byte. Evidence files checked to exclude private-key fields. Live Devnet success and no-show refund independently confirmed through official RPC. Both final English videos updated to reflect verified live transfer status; full MP4 decoding passed, affected scenes inspected at1920×1080, under180seconds each.
