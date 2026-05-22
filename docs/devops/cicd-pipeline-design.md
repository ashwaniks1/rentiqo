# Rentiqo CI/CD Pipeline Design

## 1) Pipeline goals

- Fast feedback for developers and agents.
- Deterministic quality gates before deployment.
- Reproducible artifacts for staging and production.
- Security and compliance checks integrated in delivery path.

## 2) CI stages

1. **Lint and static analysis**
   - Code style/lint checks
   - Type checks
   - Static security scanning (SAST)

2. **Unit and integration tests**
   - Service-level unit tests
   - Integration tests for key domain workflows

3. **Contract and API tests**
   - Endpoint contract validation against documented API specs
   - Backward-compatibility checks for versioned APIs

4. **Dependency and container scans**
   - Dependency vulnerability scan
   - Container image vulnerability scan

5. **Artifact build and signing**
   - Build immutable application artifacts
   - Attach version metadata and checksums

## 3) CD stages

1. Deploy to staging automatically on mainline merge.
2. Run smoke tests and synthetic checks.
3. Manual or policy-based approval gate for production promotion.
4. Canary rollout with health metrics evaluation.
5. Full rollout if error budget conditions pass.

## 4) Implemented workflow baseline (Task A3)

### CI workflow: `.github/workflows/ci.yml`

- Runs `npm ci`, `npm run typecheck`, `npm test`, and `npm run release:verify`.
- Enforces dependency risk checks on pull requests with `actions/dependency-review-action`.
- Enforces production dependency scanning with `npm audit --omit=dev --audit-level=high`.

### Staging deployment workflow: `.github/workflows/staging-deploy.yml`

- Triggers on push to `main` and manual dispatch.
- Runs preflight gates (`typecheck`, tests, release verification, observability checks).
- Uses GitHub Actions `environment: staging` for deployment policy boundaries.
- Publishes deployment run metadata as immutable artifact evidence.

## 5) Required quality gates

- No failed critical tests.
- No unresolved critical security vulnerabilities.
- Contract tests pass for public APIs.
- Smoke tests pass in staging.
- `npm run release:verify` passes.
- `bash scripts/release/check-observability-gates.sh` passes.

## 6) Rollback integration

- Maintain previous stable artifact pointer.
- Rollback action available as pipeline step.
- Incident metadata attached to rollback execution record.

## 7) Pipeline observability

- Build duration and failure trend dashboards.
- Deployment frequency and change-failure-rate tracking.
- Release health summary generated per deployment.
