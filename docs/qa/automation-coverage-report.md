# Automation Coverage Report (Stage 5 Baseline)

## Current automated coverage

### Backend
- Health route behavior test
- Auth register/login and profile behavior test coverage
- Search route schema/shape test
- Listing detail route behavior test
- Saved homes flow test
- Contact-agent and admin moderation route tests
- Critical-path integration test (login -> search -> detail -> save -> contact)

### Search service
- Ranking output order test
- Alert matcher deterministic output test
- Relevance evaluator signal test

## Coverage summary

| Domain | Automated coverage status | Gaps |
| --- | --- | --- |
| Backend services | Expanded baseline implemented | Persistence hardening and authorization edge-case coverage pending |
| Search modules | Expanded baseline implemented | Live telemetry and dataset-scale regression coverage pending |
| Mobile | API wiring in progress | RN component tests and true mobile e2e suites pending |
| End-to-end | Critical backend path implemented | Full staging/mobile e2e still pending |

## Required next coverage increments

1. Add full staging e2e that includes mobile-client execution path.
2. Add authz failure-path regression tests across agent/admin endpoints.
3. Add mobile unit/component tests for loading/error states.
4. Add release-gate assertions for compliance evidence completeness.
