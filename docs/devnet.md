# Solana Devnet rehearsal

## Actual status

On 5 October 2026, official Solana Devnet RPC independently confirmed buyer-signed deposits, provider settlement and a separate full no-show refund, each for0.15Circle test USDC. The official Devnet genesis hash, mint and6-decimal precision were checked. Fresh independent test wallets were used. These are controlled prototype receipts, not customer transactions or mainnet revenue.

Integration is implemented and transaction-fixture tests pass. Live buyer deposits, provider payout and a separate no-show refund were verified on 5 October 2026. See evidence/ for the exported records and independently checked transfers.

## Prepare fresh test accounts

```sh
npm run devnet:setup -- --airdrop
cp .env.example .env
```

Edit only this repo’s `.env`:

```dotenv
COMMIT_WF_MODE=devnet
COMMIT_WF_HOST=127.0.0.1
COMMIT_WF_PORT=4317
COMMIT_WF_ORIGIN=http://127.0.0.1:4317
COMMIT_WF_STATE=.state/devnet.sqlite
```

The generated operator pays payout transaction fees. It needs roughly 0.02–0.05 **Devnet SOL** for a small rehearsal, including new token-account rent. This is an estimate, not a fee guarantee. Use the address printed by setup, or `COMMIT_WF_MODE=devnet npm run doctor`; never print secret-key files.

Operator currently generated: `8Uf2B3CjymSZFSefuHhPBZPXDnAKGERUDErJwpoM7b7r`.

Provider currently generated: `CfdunUSjDhCqtjNxPVkqxJcMs7f2EdYxKFcmqvk6zdiM`.

These are newly created test-only addresses, not existing Commit accounts. If you regenerate on another machine, use the newly printed addresses rather than these.

Use [Solana’s faucet](https://faucet.solana.com/) for Devnet SOL. Use a **separate buyer test wallet** with Devnet SOL and [Circle’s faucet](https://faucet.circle.com/) for USDC on Solana Devnet. Any login/CAPTCHA must be completed by the user. Do not reuse the production or judging wallet.

Official test mint: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`. [Circle lists it here](https://developers.circle.com/stablecoins/usdc-contract-addresses). It is a test token with no dollar backing or financial value.

## Live success path

1. Stop the demo server. Start this repo in Devnet mode with `npm start`.
2. Verify the badge says **Solana Devnet** and connect the separate buyer wallet.
3. Quote `Solana USDC payments`, quantity 3, for a future window. Confirm reservation.
4. Review 0.15 Devnet USDC, the unique vault and quoted terms. Sign the deposit transaction.
5. After confirmation, the record must show escrow and an Explorer link. Check mint, amount and vault, not only “success.”
6. Wait until the real reserved window starts. Click refresh; there is no clock advancement in Devnet.
7. Execute, verify, then settle. The operator signs the vault payout and pays fees.
8. The final record must say `settled` and contain a confirmed payout link and zero escrow remaining.
9. Download the same-run evidence JSON. Keep both deposit and payout signatures.

## Live refund path

Create another small reservation with query `zzzzzz`, which has no matches in this declared fixed corpus. Execute after the window starts. The actual provider output has no qualifying content/citation, so verification fails. Click refund; it must return the full quote amount to the original buyer. This is an actual output-validation failure, not a Devnet fault-injection toggle.

Alternatively leave a funded order unused until its window ends; then refund the no-show. This takes ten minutes and is unnecessary for the short demo video.

## Check receipts

The application fetches parsed transactions at `confirmed`, checks `meta.err`, signer, source/destination ATAs, mint, decimals, exact amount and terms memo. Settlement requires confirmed/finalized success. A block explorer page alone does not prove the requested semantics. Use [Solana’s token-transfer documentation](https://solana.com/docs/tokens/basics/transfer-tokens) to inspect `TransferChecked`.

## Troubleshooting without a second payment

- Faucet limit: wait or use the official faucet. Continue recording the simulation while funding is pending; keep it labeled.
- Wallet lacks tokens: fund the separate buyer’s USDC ATA and Devnet SOL. The app never mints official Circle USDC.
- Deposit sent but not recognized: retry the funding action. The browser keeps the transaction signature in session storage and reuses it. **Do not sign another deposit merely because a confirmation took time.**
- Deposit transaction definitively failed: inspect its Explorer signature before clearing its session-storage entry and retrying. An unknown outcome is not a confirmed failure.
- Payout paused: preserve `.state/`. Retry checks the same outbox signature. Do not remove its record to force a new payment.
- Expired outbox with unknown outcome: reconcile the persisted signature and vault/provider/buyer balances before any operator action. Automatic replacement is intentionally disabled.
- Funds are in a vault controlled by this server. If the session cookie is lost, this prototype has no user account recovery; preserve the original browser session during a rehearsal.

Never copy old Commit keys or state into this repo. Never change the mint to mainnet USDC; startup rejects it.


## Latest live verification — 5 October 2026
Independent Devnet rehearsal confirmed buyer-signed deposits, provider payout and a separate full no-show refund, each for0.15Circle test USDC. See `evidence/` for checked receipts. Historical funding/setup instructions above are for reproducing with fresh wallets, not an unresolved gap. No market validation is claimed.
