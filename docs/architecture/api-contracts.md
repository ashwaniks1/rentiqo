# Rentiqo API Contracts (MVP Baseline)

Versioning strategy: `/v1` namespace with backward-compatible additive changes.

Authentication: Bearer JWT for protected endpoints.

## 1. Identity and profile APIs

### POST `/v1/auth/register`
- Request: email/password or federated token payload
- Response: access token, refresh token, user profile summary

### POST `/v1/auth/login`
- Request: credentials or federated token
- Response: access token, refresh token, user profile summary

### POST `/v1/auth/refresh`
- Request: refresh token
- Response: rotated access token and refresh token

### GET `/v1/me`
- Response: authenticated user profile and preferences

### PATCH `/v1/me/preferences`
- Request: notification and search preference updates
- Response: updated preference payload

## 2. Search and listing APIs

### POST `/v1/search/listings`
- Request:
  - location payload (bbox or polygon)
  - filters (price range, beds, baths, type, status)
  - pagination cursor
  - sort option
- Response:
  - result items with summary fields
  - map points
  - next cursor
  - applied filter echo

### GET `/v1/listings/{listingId}`
- Response:
  - full listing detail
  - media URLs
  - history summary
  - neighborhood summary

### GET `/v1/listings/{listingId}/history`
- Response:
  - timeline events (price/status changes)

## 3. Save and alert APIs

### POST `/v1/saved-homes`
- Request: listing ID
- Response: saved_home_id and timestamp

### DELETE `/v1/saved-homes/{listingId}`
- Response: deletion confirmation

### GET `/v1/saved-homes`
- Response: list of saved homes with summary listing payload

### POST `/v1/saved-searches`
- Request: filter and location payload + notification channels
- Response: saved_search_id

### PATCH `/v1/saved-searches/{savedSearchId}`
- Request: updated criteria or channels
- Response: updated saved search

### DELETE `/v1/saved-searches/{savedSearchId}`
- Response: deletion confirmation

## 4. Engagement APIs

### POST `/v1/listings/{listingId}/contact-agent`
- Request: message, contact preference
- Response: lead_id and status

### POST `/v1/listings/{listingId}/tour-requests`
- Request: preferred time windows, notes
- Response: tour_request_id and status

### GET `/v1/me/leads`
- Response: consumer lead/tour history

## 5. Agent APIs

### GET `/v1/agent/me/leads`
- Response: lead queue with statuses and SLA metadata

### PATCH `/v1/agent/leads/{leadId}`
- Request: status update and optional notes
- Response: updated lead status

### GET `/v1/agent/me/profile`
- Response: agent profile details

## 6. Admin APIs

### GET `/v1/admin/moderation/cases`
- Response: moderation queue

### POST `/v1/admin/moderation/cases`
- Request: target, reason, severity
- Response: case created

### PATCH `/v1/admin/moderation/cases/{caseId}`
- Request: action and resolution notes
- Response: updated case state

### GET `/v1/admin/data-quality/summary`
- Response: freshness, duplication, completeness KPIs by source

## 7. Contract quality requirements

- All endpoints return structured error envelope:
  - `code`
  - `message`
  - `trace_id`
  - `details` (optional)
- Idempotency keys required for tour request and contact create operations.
- Pagination contracts must support cursor-based traversal for large result sets.
- Contract tests required for each endpoint before release gate exit.
