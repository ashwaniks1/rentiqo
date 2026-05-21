# Automation Coverage Report (Stage 5 Baseline)

## Current automated coverage

### Backend
- Health route behavior test
- Search route schema/shape test
- Listing detail route shape test

### Search service
- Ranking output order test
- Alert matcher deterministic output test
- Relevance evaluator signal test

## Coverage summary

| Domain | Automated coverage status | Gaps |
| --- | --- | --- |
| Backend scaffolds | Baseline implemented | Auth, persistence, and integration flows pending |
| Search modules | Baseline implemented | Real index/data integration and dedupe logic pending |
| Mobile | Minimal (state smoke planned) | RN test harness and UI/e2e suites pending |
| End-to-end | Not yet implemented | Requires staging integrations and test runner setup |

## Required next coverage increments

1. Add integration tests for backend-auth/search data path.
2. Add mobile unit/component tests and basic navigation smoke suite.
3. Add staging e2e tests for core conversion workflows.
4. Add security/authorization regression checks as auth is wired.
