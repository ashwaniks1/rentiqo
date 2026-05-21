# Rentiqo Database Migration Plan (MVP)

This document defines initial migration sets for the canonical transactional database.

## Migration strategy

- Use forward-only, versioned migrations.
- One migration per bounded context change.
- Include rollback notes even when operational rollback uses forward fix migration.
- Execute migrations in staging before production with data validation checks.

## Migration set M1 - Identity and roles

Tables:
- `users`
- `user_identities`
- `user_preferences`
- `roles`
- `user_roles`

Indexes:
- unique `users.email`
- index on `user_roles.user_id`

## Migration set M2 - Listings core

Tables:
- `listings`
- `listing_history_events`
- `listing_media_assets`
- `listing_source_lineage`

Indexes:
- unique `(source_provider, external_source_id)`
- geospatial index on listing coordinates
- index on `listing_status` and `source_updated_at`

## Migration set M3 - Saved state and alerts

Tables:
- `saved_homes`
- `saved_searches`
- `alert_notifications`

Indexes:
- unique `(user_id, listing_id)` for saved homes
- index on `saved_searches.user_id`
- index on alert dedupe key

## Migration set M4 - Engagement and agent workflows

Tables:
- `agent_profiles`
- `leads`
- `tour_requests`
- `lead_status_history`

Indexes:
- index on `leads.agent_id, status, created_at`
- index on `tour_requests.status`

## Migration set M5 - Admin operations and audit

Tables:
- `moderation_cases`
- `audit_events`

Indexes:
- index on moderation case severity/status
- index on `audit_events.target_type, target_id, created_at`

## Data integrity constraints

- Foreign keys on all parent-child domain relationships.
- Check constraints on enum-like statuses.
- Created/updated timestamp defaults for all mutable entities.
- Soft-delete strategy for selected user artifacts where required by policy.

## Validation checklist per migration

1. Schema apply success.
2. Index creation success and expected query plan checks.
3. Constraint validation on seed/synthetic data.
4. Backward compatibility verification for API contracts.
