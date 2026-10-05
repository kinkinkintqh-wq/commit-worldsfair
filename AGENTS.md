# Independent Commit World’s Fair repository

- Work only in this repository. Existing Commit repositories, branches, domains, contracts, databases and online services are read-only references.
- Never add the earlier Commit repository as a push target. Never import old `.env`, credentials, `.git`, deployment scripts or state.
- Use only `COMMIT_WF_*` configuration. Runtime state and fresh test keys must stay in this repository’s `.state/` and must never be committed.
- Default is simulation. Devnet is the only blockchain environment. Keep exact Circle USDC mint and genesis-hash checks.
- Do not call this version trustless escrow: server-controlled vaults and verification are explicit prototype assumptions.
- Do not invent traction, customers, revenue, partnerships, funding, AI inference or live-chain receipts.
- Tests must verify outcomes and isolation. No old environment may be used to test.
- Deployment preparation is authorized; deployment, domain/DNS changes, publication and contest submission require the relevant explicit instruction.
