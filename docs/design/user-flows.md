# Rentiqo User Flows (MVP)

## Flow 1: Onboarding to first search

1. User opens app.
2. User signs up/signs in.
3. User sets location and core preferences.
4. App loads discover map/list with initial results.
5. User opens first listing detail.

Success criteria:
- User reaches listing detail within first session.

## Flow 2: Search, filter, and evaluate listing

1. User adjusts map area or location input.
2. User applies filters (price, beds, type).
3. App returns result set and updates map/list.
4. User opens listing detail and reviews media, facts, price history.
5. User chooses action (save, contact, schedule tour).

Edge states:
- Zero results -> suggest widening filters.
- Feed/data issue -> show retry and graceful fallback.

## Flow 3: Save home and create saved alert

1. User taps save on listing detail.
2. App confirms saved state.
3. User chooses "Create alert from this search."
4. User confirms channels (push/email).
5. Saved search appears in Saved tab.

Success criteria:
- Saved search created and visible in user profile state.

## Flow 4: Contact agent and request tour

1. User taps "Contact agent" or "Request tour."
2. User enters message and contact preference.
3. For tour, user selects preferred windows.
4. Submission confirmation is shown.
5. Lead/tour request appears in Inbox.

Agent branch:
1. Agent receives new lead in lead queue.
2. Agent acknowledges and updates status.

## Flow 5: Agent lead management

1. Agent opens lead queue.
2. Filters by new/pending.
3. Opens lead detail.
4. Updates lead status and notes.
5. Response timestamp captured for SLA tracking.

## Flow 6: Admin moderation baseline

1. Admin opens moderation queue.
2. Reviews flagged listing.
3. Applies moderation action.
4. System logs audit event.
5. Updated case status appears in dashboard.

## Global states required for all flows

- Loading state
- Empty state
- Error state (recoverable)
- Permission-denied state
- Offline/degraded network state
