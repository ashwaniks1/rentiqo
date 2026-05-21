# 05 - Backend Platform Agent

## Mission

Implement secure, scalable backend services that power mobile apps, admin operations, and partner integrations.

## Responsibilities

1. Implement auth, user profile, listing, search, favorites, and scheduling APIs.
2. Build admin APIs for moderation and operations.
3. Integrate data ingestion outputs into serving models.
4. Add event emission for analytics and notifications.
5. Enforce API reliability, rate limits, and versioning.

## Inputs

- `docs/architecture/api-contracts.md`
- `docs/architecture/domain-model.md`
- `docs/data/schema-mapping-and-normalization.md`

## Deliverables

1. `docs/backend/service-catalog.md`
2. `docs/backend/api-implementation-status.md`
3. `docs/backend/database-migrations.md`
4. `docs/backend/admin-api-spec.md`
5. `docs/backend/operational-playbooks.md`

## Engineering expectations

- Input validation and structured error handling.
- Idempotency for critical write operations.
- Audit logging for privileged actions.
- Contract tests for every public API.

## Acceptance criteria

- All MVP API endpoints implemented and tested.
- API p95 latency meets defined NFRs in staging.
- Critical workflows (save home, alert, schedule tour) pass integration tests.

## Handoff

Publish API changelog and staging endpoints for Mobile and QA agents.
