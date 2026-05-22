# Release Quality Gates

These gates are mandatory before moving from release candidate to production.

## Gate Q1 - Build and static checks

- [ ] Typecheck passes across all workspaces.
- [ ] Lint/static checks pass (once lint pipeline is enabled).
- [ ] Dependency/security scan has no unresolved critical findings.

## Gate Q2 - Automated test checks

- [ ] Backend unit/integration suites pass.
- [ ] Search service unit/integration suites pass.
- [x] Mobile staging smoke suite baseline passes (`npm run test:staging-e2e`).
- [ ] Critical test cases from `docs/qa/test-case-matrix.md` marked pass for current scope.

## Gate Q3 - Staging functional validation

- [x] Search -> listing -> save journey validated.
- [x] Contact/tour request flow validated.
- [ ] Alert flow validated for saved searches.
- [x] Admin moderation baseline validated. (backend route coverage)

Validation evidence:
- Runner script: `scripts/qa/run-staging-mobile-e2e.sh`
- Mobile smoke script: `apps/mobile/e2e/staging-mobile-smoke.ts`
- CI job: `.github/workflows/ci.yml` -> `staging_mobile_e2e`

## Gate Q4 - Non-functional and operational checks

- [ ] Latency and availability thresholds meet NFR baselines.
- [ ] Crash-free session target meets threshold in RC build.
- [ ] Observability dashboards/alerts active for release scope.
- [ ] Rollback runbook tested and available.

## Stop-ship rules

- Any open P0 or critical security issue.
- Failing critical automated test in CI.
- Missing rollback path for release candidate.
