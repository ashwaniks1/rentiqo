# Saved Search Alerting Logic

## Goal

Notify users when newly relevant listings or meaningful listing changes match their saved searches.

## Trigger events

- New listing enters a saved search result set.
- Price reduction on matching listing.
- Status change on matching listing.

## Matching pipeline

1. Ingestion emits listing change event.
2. Alert matcher evaluates candidate saved searches.
3. Dedupe key generated per user + saved_search + listing + event_type.
4. If not previously sent, enqueue notification dispatch.

## Current implementation baseline

- Matcher is implemented in `services/search/src/alerts/matcher.ts`.
- Event type is derived deterministically from changed fields (`new_listing`, `price_change`, `status_change`, `listing_update`).
- Matcher supports fingerprint-aware matching via `changedFields` entries like `fingerprint:<normalized-query-fingerprint>`.
- Dedupe key generation is enforced as `userId:savedSearchId:listingId:eventType`.

## Production requirements

- Exact matching by normalized filter and location criteria.
- Dedupe persistence to prevent repeated spam notifications.
- Delivery status tracking and retry for transient failures.
