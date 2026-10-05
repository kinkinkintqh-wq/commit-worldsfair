# Independent deployment preparation

**No deployment has been performed.** No existing cloud project, domain, DNS record, process, repository branch or online environment was changed.

The current handoff includes an independent Dockerfile and Compose project. Docker execution was not available/verified in this session; the native Node build and local preview were verified. Do not claim a tested container image or public URL until those checks exist.

## Local isolated container option

If Docker is already installed, run from this new repository only:

```sh
docker compose -p commit-worldsfair-isolated up --build
```

This creates a uniquely named local service and state volume, and binds only `127.0.0.1:4317`. It does not use old Commit Compose files, volumes or host ports. Do not run this command in an existing project directory.

## New hosted project plan

1. Create a **new hosting project/app** with a distinct name such as `commit-worldsfair-hoikin`; this is a proposed name, not a provisioned resource.
2. Deploy from this new repository only. Never connect the earlier Commit repo or a judging branch.
3. Start with demo mode, one instance and a persistent volume mounted at `/app/.state`. The default internal port is 4317.
4. Set `COMMIT_WF_ORIGIN` to the exact new HTTPS app URL and `COMMIT_WF_HOST=0.0.0.0`. If the hosting service assigns a port, set `COMMIT_WF_PORT` explicitly to that value.
5. Keep the new host-generated URL. Do not point `commit.jibai.site` or any existing domain at it, and do not reuse the existing server or Caddy configuration.
6. Verify `/healthz`, quote/reserve, success/refund and session ownership from the new URL. Keep simulation disclosures visible.
7. Only after separate approval for that concrete hosting target should an actual deploy occur. This package prepares the work; it does not publish.

## Devnet hosting

The UI wallet path needs HTTPS or localhost. Devnet uses server-held test custody keys and persistent SQLite/outbox state; do not put it on ephemeral/multiple replicas. Generate fresh hosted test-only keys, use Circle test USDC and the fixed public Devnet RPC, fund the operator for fees, and keep the volume private. Do not upload the local `.state/` directory as a public build artifact or reuse keys from an existing project.

Hosted Devnet custody and external user access require a concrete review of the new hosting configuration. For the immediate submission, an honest simulation demo plus real local Devnet receipts is preferable to claiming that an unreviewed public custody service is production-ready.

## Rollback

Stop only the new service/app. Preserve its state volume if any token operation is pending. No migration or rollback action should touch the prior Commit project. Deleting a cloud project/volume is a separate consequential action; this runbook does not authorize it.
