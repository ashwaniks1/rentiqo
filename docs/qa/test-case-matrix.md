# Rentiqo Test Case Matrix (MVP Critical Paths)

## Legend
- Priority: P0 (must pass), P1 (high), P2 (nice to have)
- Type: U (unit), I (integration), E (end-to-end)

| ID | Flow | Type | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Backend health endpoint returns success payload | U/I | P0 | Implemented (unit) | Scaffold coverage in backend tests |
| TC-002 | Search endpoint returns structured response envelope | U/I | P0 | Implemented (unit/integration) | Ranking version and item shape validated |
| TC-003 | Listing detail endpoint handles id path and response schema | U/I | P0 | Implemented (unit/integration) | Live listing detail path validated |
| TC-004 | Search ranking deterministic ordering with same inputs | U | P0 | Implemented (unit) | Rule-v2 ranking tests active |
| TC-005 | Alert matcher emits expected matches for saved searches | U | P1 | Implemented (unit) | Dedupe key behavior validated |
| TC-006 | Baseline relevance evaluator computes top-3 click signal | U | P1 | Implemented (unit) | Conversion score validated |
| TC-007 | Mobile saved-home state add/remove behavior | U | P1 | Planned | Add mobile state tests after RN test harness setup |
| TC-008 | Search -> listing -> save journey in staging | E | P0 | Implemented (integration baseline) | Backend critical-path integration test implemented |
| TC-009 | Save search -> alert generation -> notification dispatch | I/E | P0 | In progress | API baseline done, delivery pipeline pending |
| TC-010 | Contact agent -> lead appears in agent queue | I/E | P0 | Implemented (unit/integration) | Route tests validate lead queue visibility |
| TC-011 | Admin moderation action creates audit event | I | P1 | Planned | Requires admin API implementation |
| TC-012 | Unauthorized access blocked for protected routes | I | P0 | Planned | Requires auth + RBAC implementation |

## Notes

- Stage 5 currently focuses on enforcing executable test scaffolding and CI gates while Stage 4 integrations continue.
- Planned tests become mandatory for Stage 6 go/no-go.
