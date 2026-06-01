# Rentiqo API Implementation Status (Implementation Update)

This file tracks implementation readiness against the API contract baseline in `docs/architecture/api-contracts.md`.

Status keys:
- **Done:** implemented, tested, and verified in local CI
- **In progress:** implemented baseline, needs production hardening
- **Ready for implementation:** contract finalized, build tasks can start

## Identity APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/auth/register` | Done | Password policy enforcement (length + letter + digit) implemented and tested |
| POST `/v1/auth/login` | Done | Login + token issuance implemented with lockout controls after repeated failures |
| POST `/v1/auth/refresh` | Done | Refresh token rotation baseline implemented |
| POST `/v1/auth/logout` | Done | Session revocation endpoint implemented and integration-tested |
| GET `/v1/me` | Done | Authenticated profile payload implemented |
| PATCH `/v1/me/preferences` | Done | Preference update endpoint implemented |

## Search and listing APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/search/listings` | Done | Connected to search-service query module |
| GET `/v1/listings/{listingId}` | Done | Listing detail retrieval implemented |
| GET `/v1/listings/{listingId}/history` | Done | Listing history endpoint implemented |

## Saved state APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/saved-homes` | Done | Save home flow implemented |
| DELETE `/v1/saved-homes/{listingId}` | Done | Remove saved home implemented |
| GET `/v1/saved-homes` | Done | Saved home listing implemented |
| POST `/v1/saved-searches` | Done | Saved search creation implemented |
| PATCH `/v1/saved-searches/{savedSearchId}` | Done | Saved search update implemented |
| DELETE `/v1/saved-searches/{savedSearchId}` | Done | Saved search delete implemented |

## Engagement APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| POST `/v1/listings/{listingId}/contact-agent` | Done | Lead creation flow implemented |
| POST `/v1/listings/{listingId}/tour-requests` | Done | Tour request flow implemented |
| GET `/v1/me/leads` | Done | Consumer lead history implemented |

## Agent APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| GET `/v1/agent/me/leads` | Done | Agent queue endpoint implemented with role checks |
| PATCH `/v1/agent/leads/{leadId}` | Done | Agent status update endpoint implemented |
| GET `/v1/agent/me/profile` | Done | Agent profile endpoint implemented |

## Admin APIs

| Endpoint | Status | Notes |
| --- | --- | --- |
| GET `/v1/admin/moderation/cases` | Done | Admin moderation list endpoint implemented |
| POST `/v1/admin/moderation/cases` | Done | Moderation case creation implemented |
| PATCH `/v1/admin/moderation/cases/{caseId}` | Done | Moderation update + audit event implemented |
| GET `/v1/admin/data-quality/summary` | Done | Data quality summary baseline implemented |

## Verification evidence

- Unit/integration route tests: `apps/backend/src/__tests__/v1-routes.test.ts`
- Critical path integration test: `apps/backend/src/__tests__/critical-path.integration.test.ts`
- Validation commands:
  - `npm run typecheck` (pass)
  - `npm test` (pass)
  - `set -a && . apps/backend/.env && set +a && npm run db:migrate -w @rentiqo/backend` (pass)
  - `set -a && . apps/backend/.env && set +a && npx tsx --test apps/backend/src/__tests__/critical-path.integration.test.ts` (pass)

## Remaining hardening work

1. ~~Replace plaintext password handling with salted hashing + secure credential lifecycle.~~ **Done** — bcrypt (12 rounds) via `bcryptjs`.
2. Move login lockout/session revocation controls to a distributed policy store for multi-instance deployments.
3. Add explicit API schema contract tests and staging smoke evidence capture in CI.
