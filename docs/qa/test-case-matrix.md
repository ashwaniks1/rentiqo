# Rentiqo Test Case Matrix (MVP Critical Paths)

## Legend
- Priority: P0 (must pass), P1 (high), P2 (nice to have)
- Type: U (unit), I (integration), E (end-to-end)

| ID | Flow | Type | Priority | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| TC-001 | Backend health endpoint returns success payload | U/I | P0 | Implemented (unit) | Scaffold coverage in backend tests |
| TC-002 | Search endpoint returns structured response envelope | U/I | P0 | Implemented (unit) | Placeholder response currently expected |
| TC-003 | Listing detail endpoint handles id path and response schema | U/I | P0 | Implemented (unit) | Placeholder listing detail behavior |
| TC-004 | Search ranking deterministic ordering with same inputs | U | P0 | Implemented (unit) | Search ranking test scaffolded |
| TC-005 | Alert matcher emits expected matches for saved searches | U | P1 | Implemented (unit) | Deterministic matcher baseline |
| TC-006 | Baseline relevance evaluator computes top-3 click signal | U | P1 | Implemented (unit) | Baseline evaluation module |
| TC-007 | Mobile saved-home state add/remove behavior | U | P1 | Planned | Add mobile state tests after RN test harness setup |
| TC-008 | Search -> listing -> save journey in staging | E | P0 | Planned | Requires API integration completion |
| TC-009 | Save search -> alert generation -> notification dispatch | I/E | P0 | Planned | Requires alert service and queue wiring |
| TC-010 | Contact agent -> lead appears in agent queue | I/E | P0 | Planned | Requires engagement and agent APIs |
| TC-011 | Admin moderation action creates audit event | I | P1 | Planned | Requires admin API implementation |
| TC-012 | Unauthorized access blocked for protected routes | I | P0 | Planned | Requires auth + RBAC implementation |

## Notes

- Stage 5 currently focuses on enforcing executable test scaffolding and CI gates while Stage 4 integrations continue.
- Planned tests become mandatory for Stage 6 go/no-go.
