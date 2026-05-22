# Automation Coverage Report (Stage 5 Baseline)

## Current automated coverage

### Backend
- Health route behavior test
- Auth register/login and profile behavior test coverage
- Auth hardening coverage (password policy, login lockout, logout session revocation)
- Search route schema/shape test
- Listing detail route behavior test
- Saved homes flow test
- Contact-agent and admin moderation route tests
- Critical-path integration test (login -> search -> detail -> save -> contact)
- Critical-path integration extension validating logout token revocation

### Search service
- Ranking output order test
- Alert matcher deterministic output test
- Relevance evaluator signal test

### Staging/mobile e2e
- Staging runner script starts backend and executes mobile API smoke journey
- Mobile smoke covers login -> search -> listing detail -> save/remove -> contact -> tour -> inbox assertions
- CI workflow includes dedicated `staging_mobile_e2e` job for evidence generation

## Coverage summary

| Domain | Automated coverage status | Gaps |
| --- | --- | --- |
| Backend services | Expanded baseline implemented | Persistence hardening and authorization edge-case coverage pending |
| Search modules | Expanded baseline implemented | Live telemetry and dataset-scale regression coverage pending |
| Mobile | Staging API smoke baseline implemented | RN component tests and device/emulator UI e2e suites pending |
| End-to-end | Backend + mobile staging smoke implemented | Alert delivery path and device-level full-fidelity journeys pending |

## Required next coverage increments

1. Expand staging smoke to include saved-search alert delivery assertions.
2. Add authz failure-path regression tests across agent/admin endpoints.
3. Add mobile unit/component tests for loading/error states.
4. Add release-gate assertions for compliance evidence completeness.
