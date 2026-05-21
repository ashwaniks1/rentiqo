# Rentiqo API Implementation Status (Stage 3)

This file tracks implementation readiness against the API contract baseline in `docs/architecture/api-contracts.md`.

Status keys:
- **Ready for implementation:** contract finalized, build tasks can start
- **In progress:** implementation underway
- **Done:** implemented, tested, and verified

## Identity APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/auth/register` | Ready for implementation | Requires auth provider adapter |
| POST `/v1/auth/login` | Ready for implementation | Must include brute-force protections |
| POST `/v1/auth/refresh` | Ready for implementation | Token rotation strategy defined |
| GET `/v1/me` | Ready for implementation | Role-aware payload |
| PATCH `/v1/me/preferences` | Ready for implementation | Preference schema finalized |

## Search and listing APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/search/listings` | Ready for implementation | Depends on index schema and filters |
| GET `/v1/listings/{listingId}` | Ready for implementation | Depends on canonical listing model |
| GET `/v1/listings/{listingId}/history` | Ready for implementation | History event model documented |

## Saved state APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/saved-homes` | Ready for implementation | Requires idempotency consideration |
| DELETE `/v1/saved-homes/{listingId}` | Ready for implementation | Soft-delete policy TBD |
| GET `/v1/saved-homes` | Ready for implementation | Cursor pagination required |
| POST `/v1/saved-searches` | Ready for implementation | Alert channel validation needed |
| PATCH `/v1/saved-searches/{savedSearchId}` | Ready for implementation | Partial update semantics required |
| DELETE `/v1/saved-searches/{savedSearchId}` | Ready for implementation | Cascade behavior defined in DB policy |

## Engagement APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/listings/{listingId}/contact-agent` | Ready for implementation | Event emission required |
| POST `/v1/listings/{listingId}/tour-requests` | Ready for implementation | Time window validation required |
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

1. Backend code scaffolding and route skeleton generation.
2. Contract test harness for all v1 endpoints.
3. Staging deployment with smoke tests.
