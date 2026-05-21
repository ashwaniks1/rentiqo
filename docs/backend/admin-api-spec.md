# Rentiqo Admin API Specification (MVP)

Admin APIs are internal and protected by strict RBAC plus audit logging.

## Authorization requirements

- Role required: `admin` (or higher internal policy role)
- Every write action must generate an audit event with actor identity and reason
- Access limited to internal network boundary and authenticated tokens

## 1) Moderation case list

### GET `/v1/admin/moderation/cases`

Query params:
- `status` (optional)
- `severity` (optional)
- `target_type` (optional)
- `cursor` and `limit`

Response:
- paginated moderation cases
- metadata: total approximate count, cursor

## 2) Create moderation case

### POST `/v1/admin/moderation/cases`

Request body:
- `target_type` (`listing` | `user` | `agent`)
- `target_id`
- `reason_code`
- `severity`
- `notes` (optional)

Response:
- created case payload with `case_id`

Validation rules:
- `target_id` must exist
- reason/severity enums must match policy dictionary

## 3) Update moderation case

### PATCH `/v1/admin/moderation/cases/{caseId}`

Request body:
- `status`
- `action_taken`
- `resolution_notes`
- `reason_for_action`

Response:
- updated case with timestamps and resolver identity

Validation rules:
- closed status requires `resolution_notes`
- action requires `reason_for_action`

## 4) Data quality summary

### GET `/v1/admin/data-quality/summary`

Response:
- source-level metrics:
  - freshness compliance
  - duplicate rate
  - completeness score
  - ingestion run success ratio
- trend snapshots (24h, 7d)

## 5) Audit event retrieval (internal use)

### GET `/v1/admin/audit-events`

Query params:
- `actor_id`
- `target_type`
- `target_id`
- `from`, `to`
- pagination cursor

Response:
- paginated audit event records

## Error envelope

All admin APIs must return standardized error format:
- `code`
- `message`
- `trace_id`
- `details` (optional)
