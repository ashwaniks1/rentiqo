# Rentiqo Observability Gate Checks

This artifact defines the minimum observability conditions required for staging promotion and incident readiness.

## 1) Gate checks executed in automation

The following checks are enforced before the staging deployment baseline job runs:

1. `npm run typecheck`
2. `npm test`
3. `npm run release:verify`
4. `bash scripts/release/check-observability-gates.sh`

These checks are run in:

- `.github/workflows/ci.yml`
- `.github/workflows/staging-deploy.yml`

## 2) SLO and error budget gates

Before promoting a candidate in staging, all service owners confirm:

- Core API availability target remains at or above 99.9% for the current measurement window.
- Search p95 latency remains at or below 800 ms.
- Listing detail p95 latency remains at or below 500 ms.
- Alert processing success remains at or above 99%.
- Monthly error budget burn rate is within the allowed threshold for continued releases.

If any threshold is breached, deployment promotion pauses until mitigation and incident review are complete.

## 3) Incident routing and escalation gates

- Severity routing must be documented in `docs/devops/incident-routing-matrix.md`.
- On-call ownership must be active in `docs/program/oncall-operations-plan.md`.
- Incident response steps must map to `docs/devops/incident-response-runbook.md`.

## 4) Evidence expectations

- Staging deployment workflow uploads `staging-deploy-metadata` as immutable run evidence.
- Rollback evidence is tracked in `docs/program/rollback-validation-report.md`.
- Release package references remain listed in `docs/release/release-evidence-manifest.md`.
