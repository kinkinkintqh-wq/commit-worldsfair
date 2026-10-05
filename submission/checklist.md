# Submission checklist

Official deadline in the rules: **12 October 2026, 23:59 Pacific**, or **13 October 2026, 14:59 Hong Kong/Shanghai**. Internal target: **11 October**. Source: [official rules](https://colosseum.com/legal/Crypto%20World's%20Fair%20Hackathon%20Rules.pdf). Recheck the dashboard before submitting.

## Delivered

- [x] Separate repository with independent history, state, configuration and port.
- [x] Existing Commit code/assets identified read-only; relevant history disclosed.
- [x] Product IA and responsive English UX.
- [x] Runnable Quote → Reserve → Escrow → Execute → Verify → Settle / Refund simulation.
- [x] Solana Devnet USDC deposit/payout/refund implementation and wallet flow.
- [x] Live Devnet genesis/mint check; fresh test-only operator/provider accounts.
- [x] Tests for quota conflicts, quote expiry, state guards, money conservation, retries and session isolation.
- [x] Transaction-fixture tests for exact deposits and safe payout retry/freeze behavior.
- [x] README, architecture, demo data, runbook and deployment preparation.
- [x] Three-minute English pitch, short pitch and application content blocks.
- [x] Honest team/traction statement: Hoikin, Hong Kong, solo; no customers/revenue/external pilots/funding.

## Before calling the Solana track submission ready

- [ ] Fund the new operator with Devnet SOL, and a separate buyer test wallet with Devnet SOL + Circle Devnet USDC.
- [ ] Rehearse one real deposit and verified payout; capture same-run signatures and amounts.
- [ ] Rehearse a real output-validation failure and refund; capture its separate same-run evidence.
- [ ] Confirm neither mainnet tokens nor old Commit wallets/contracts were involved.
- [ ] Update the application/pitch only to the extent supported by the new receipts.

## User account / publishing steps

- [ ] Register Hoikin’s account and join the active hackathon. Review eligibility and accept rules personally.
- [ ] Publish only this new repo, or create a new private repo and grant the official review access indicated by the submission portal. Do not change access on the earlier repo.
- [ ] Record/upload a **2–3 minute English presentation** and a **product demo of no more than 3 minutes**. Use the supplied scripts and actual UI.
- [ ] Add repository, video and any independent demo links to the application. No placeholder links.
- [ ] Upload `web/assets/logo.svg` or the available PNG logo where accepted.
- [ ] Check all team/location/background fields and the exact prior-work date disclosure.
- [ ] Review any accelerator commitment questions yourself.
- [ ] Submit through the live portal and save its confirmation. This delivery has not performed the submission.

## Final quality pass

- [ ] Project opens without requiring existing production keys or environments.
- [ ] Demo and Devnet labels remain visible; a simulation screenshot is not described as a live transaction.
- [ ] No claimed customer, partnership, revenue, reliability metric, decentralized custody or deployed custom escrow program without proof.
- [ ] Failure shows failed checks, a full refund and zero provider payment.
- [ ] Same-run terms, output, verification and receipt can be followed in one evidence file.
- [ ] Git tracked files contain no `.env`, `.state/`, vault keys, session secrets or npm cache.
- [ ] Links are accessible to judges without editing any existing project or domain.

Source for video/repository guidance: [Colosseum submission FAQ](https://colosseum.com/hackathon). Exact authenticated-portal limits and fields were not inspected and take precedence over this draft.
