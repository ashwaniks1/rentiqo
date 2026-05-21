# Rentiqo Domain Model

## 1. Core entities

## User
- `user_id`
- `role` (consumer, agent, admin)
- `email`, `phone` (optional), auth identities
- `notification_preferences`
- `search_preferences`
- timestamps

## AgentProfile
- `agent_id` (references User)
- `license_metadata` (region-specific)
- `service_areas`
- `rating_summary`
- `is_verified`

## Listing
- `listing_id` (canonical internal ID)
- `external_source_id`
- `source_provider`
- address and geolocation
- property attributes (type, beds, baths, area, lot, year built)
- pricing attributes (list price, rent price, fee fields)
- status (active, pending, sold, rented, off-market)
- media references
- timestamps (`source_updated_at`, `ingested_at`)

## ListingHistoryEvent
- `history_event_id`
- `listing_id`
- `event_type` (price_change, status_change, metadata_update)
- event payload and timestamp

## SavedHome
- `saved_home_id`
- `user_id`
- `listing_id`
- created timestamp

## SavedSearch
- `saved_search_id`
- `user_id`
- query/filter JSON
- notification channel preferences
- last evaluated timestamp

## AlertNotification
- `alert_id`
- `user_id`
- `saved_search_id`
- matched listing IDs
- delivery channel and status
- dedupe key

## Lead
- `lead_id`
- `listing_id`
- `user_id` (consumer)
- `agent_id`
- `lead_type` (contact_request, tour_request)
- message payload
- status (new, acknowledged, in_progress, closed)
- SLA timestamps

## TourRequest
- `tour_request_id`
- `lead_id`
- preferred time windows
- scheduling status

## ModerationCase
- `case_id`
- target type (listing, user, agent)
- reason code
- action taken
- actor and audit references

## AuditEvent
- `audit_event_id`
- actor identity
- action
- target
- request metadata
- timestamp

## 2. Entity relationships

- User (1) -> (0..1) AgentProfile
- User (1) -> (0..n) SavedHome
- User (1) -> (0..n) SavedSearch
- User (1) -> (0..n) AlertNotification
- Listing (1) -> (0..n) ListingHistoryEvent
- Listing (1) -> (0..n) Lead
- Lead (1) -> (0..1) TourRequest
- Admin User (1) -> (0..n) ModerationCase
- Admin/User actions -> (0..n) AuditEvent

## 3. Bounded context mapping

- **Identity Context:** User, AgentProfile
- **Listings Context:** Listing, ListingHistoryEvent
- **Discovery Context:** SavedSearch, Search query schema
- **Engagement Context:** Lead, TourRequest
- **Trust and Ops Context:** ModerationCase, AuditEvent
- **Notification Context:** AlertNotification

## 4. Data ownership

- Identity Service owns User and session metadata.
- Listing Service owns canonical Listing schema.
- Search Service owns indexed document view (derived from Listing).
- Engagement Service owns Lead and TourRequest state transitions.
- Admin Ops Service owns ModerationCase and policy actions.

## 5. Domain invariants

1. Canonical listing IDs are immutable once assigned.
2. Saved home records must reference active user and listing identities.
3. Alert delivery must be deduplicated per user + saved search + listing change.
4. Every admin moderation action must emit an audit event.
5. Lead state transitions must be monotonic and timestamped.
