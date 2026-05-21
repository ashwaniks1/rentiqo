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

## 4) Required quality gates

- No failed critical tests.
- No unresolved critical security vulnerabilities.
- Contract tests pass for public APIs.
- Smoke tests pass in staging.

## 5) Rollback integration

- Maintain previous stable artifact pointer.
- Rollback action available as pipeline step.
- Incident metadata attached to rollback execution record.

## 6) Pipeline observability

- Build duration and failure trend dashboards.
- Deployment frequency and change-failure-rate tracking.
- Release health summary generated per deployment.
