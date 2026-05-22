# Rentiqo API Implementation Status (Stage 3)

This file tracks implementation readiness against the API contract baseline in `docs/architecture/api-contracts.md`.

Status keys:
- **Ready for implementation:** contract finalized, build tasks can start
- **In progress:** implementation underway
- **Done:** implemented, tested, and verified

## Identity APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/auth/register` | Done | In-memory auth provider, token issuance, and audit hooks implemented |
| POST `/v1/auth/login` | Done | Credential login, session creation, and audit hooks implemented |
| POST `/v1/auth/refresh` | Done | Refresh token rotation and invalid token handling implemented |
| GET `/v1/me` | Done | Authenticated profile payload with RBAC guard scaffolding |
| PATCH `/v1/me/preferences` | Done | Preference patch handling with audit event logging |

## Search and listing APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/search/listings` | Done | Backend now calls search-service query pipeline over seeded dataset |
| GET `/v1/listings/{listingId}` | Done | Listing data source abstraction wired to seeded canonical listing records |
| GET `/v1/listings/{listingId}/history` | Done | History timeline from listing data source implemented |

## Saved state APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/saved-homes` | Done | Create saved-home endpoint implemented with auth and audit hooks |
| DELETE `/v1/saved-homes/{listingId}` | Done | Delete saved-home endpoint implemented |
| GET `/v1/saved-homes` | Done | Saved-home list endpoint implemented with listing summary hydration |
| POST `/v1/saved-searches` | Done | Saved-search create endpoint implemented with channels and query payload |
| PATCH `/v1/saved-searches/{savedSearchId}` | Done | Partial update semantics implemented |
| DELETE `/v1/saved-searches/{savedSearchId}` | Done | Delete endpoint implemented with not-found handling |

## Engagement APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/listings/{listingId}/contact-agent` | Done | Idempotency-key enforcement and lead creation implemented |
| POST `/v1/listings/{listingId}/tour-requests` | Done | Idempotency-key enforcement and tour request creation implemented |
| GET `/v1/me/leads` | Ready for implementation | Consumer history view |

## Agent APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| GET `/v1/agent/me/leads` | Ready for implementation | RBAC enforcement required |
| PATCH `/v1/agent/leads/{leadId}` | Ready for implementation | Transition guardrails required |
| GET `/v1/agent/me/profile` | Ready for implementation | Verification state support |

## Admin APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| GET `/v1/admin/moderation/cases` | Ready for implementation | Privileged route audit logs mandatory |
| POST `/v1/admin/moderation/cases` | Ready for implementation | Reason/severity enums required |
| PATCH `/v1/admin/moderation/cases/{caseId}` | Ready for implementation | Action reason mandatory |
| GET `/v1/admin/data-quality/summary` | Ready for implementation | Depends on quality metric pipeline |

## Next milestones

1. Replace in-memory stores with persistent adapters (DB/cache) while preserving endpoint contracts.
2. Add dedicated contract test harness for all v1 endpoints and error envelopes.
3. Extend RBAC guard scaffolding to agent/admin endpoints and wire policy config.
