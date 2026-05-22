# Rentiqo MVP Task Board

Status keys: `TODO`, `IN_PROGRESS`, `DONE`, `BLOCKED`.

## Active implementation board

| Task ID | Area | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| MVP-BE-001 | Backend | Implement `/v1/auth/register`, `/v1/auth/login`, `/v1/auth/refresh`, `/v1/me`, `/v1/me/preferences` | Lead Implementation Agent | DONE | Implemented with in-memory auth service, refresh rotation, RBAC scaffolding, and audit hooks |
| MVP-BE-002 | Backend | Implement `/v1/search/listings` integration with search service | Lead Implementation Agent | DONE | Wired backend controller to search-service query pipeline |
| MVP-BE-003 | Backend | Implement `/v1/listings/:id` and listing history via data-source abstraction | Lead Implementation Agent | DONE | Seeded listing data source abstraction added |
| MVP-BE-004 | Backend | Implement saved homes and saved searches CRUD APIs | Lead Implementation Agent | DONE | Auth-guarded CRUD implemented and tested |
| MVP-BE-005 | Backend | Implement contact-agent and tour-request creation | Lead Implementation Agent | DONE | Idempotency-key enforcement and audit hooks implemented |
| MVP-SRCH-001 | Search | Implement real query/filter pipeline over seeded dataset abstraction | Lead Implementation Agent | DONE | New listing dataset + query pipeline modules added |
| MVP-SRCH-002 | Search | Deterministic ranking with version label | Lead Implementation Agent | DONE | `v1-rule-based-mvp` ranking metadata and deterministic tie-breaking added |
| MVP-SRCH-003 | Search | Saved-search matching with dedupe key generation | Lead Implementation Agent | DONE | Matcher now supports fingerprint signals + deterministic dedupe keys |
| MVP-QA-001 | Quality | Add/extend tests for implemented backend and search behaviors | Lead Implementation Agent | DONE | Backend + search regression tests expanded |
| MVP-QA-002 | Quality | Validate `npm run typecheck`, `npm test`, `npm run release:verify` | Lead Implementation Agent | DONE | Commands executed successfully in this implementation run |

## Follow-up board

| Task ID | Area | Task | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| MVP-BE-006 | Backend | Replace in-memory auth/saved/engagement stores with persistent adapters | Backend Platform | TODO | Keep contracts and audit behavior stable |
| MVP-SRCH-004 | Search | Add engagement-informed reranking features | Search & Recommendations | TODO | Must preserve deterministic fallback path |
| MVP-CONTRACT-001 | Backend + QA | Add explicit contract test suites for all v1 routes | Backend Platform + QA | TODO | Validate success + structured error envelope |
