# Rentiqo Test Strategy (Stage 5)

## 1) Quality goals

The test strategy ensures release confidence across:
- Core consumer journeys (search, listing, save, alert, contact/tour)
- Agent/admin critical operations
- Platform reliability and security guardrails

## 2) Test pyramid

1. **Unit tests** (largest layer)
   - Business logic modules (ranking, matching, state handlers)
   - Route/controller behavior contracts

2. **Integration tests**
   - API route + module integration
   - Search-service contract and event flow checks
   - Persistence layer integration (as services are wired)

3. **End-to-end tests**
   - Mobile + backend + search integrated staging flows
   - Critical conversion journeys only for MVP

## 3) Test scope by system

### Backend (`apps/backend`)
- Route handling and error envelope consistency
- Basic contract behavior for scaffold endpoints
- Future: auth, saved state, engagement workflows

### Search service (`services/search`)
- Ranking determinism and ordering invariants
- Alert matching logic and dedupe preconditions
- Relevance baseline evaluator behavior

### Mobile (`apps/mobile`)
- Screen-level smoke checks
- State transitions for saved-home behavior
- Future: API integration and navigation deep-link scenarios

## 4) Non-functional testing

- API latency and throughput smoke benchmarks (staging)
- Crash and startup measurements in release candidates
- Security checks (dependency scan, secrets policy, auth path tests)

## 5) Exit criteria for release candidate

- All critical unit/integration suites pass in CI.
- No unresolved blocker/critical defects.
- Stage 5 quality gates (`docs/qa/release-quality-gates.md`) satisfied.

## 6) Defect management policy

- P0/P1 defects block release.
- P2/P3 defects require triage decision with documented mitigation.
- Reopened defects are escalated by one severity tier if regression repeats.
