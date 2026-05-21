# Rentiqo Backlog - Epics and Stories

This backlog is prioritized for MVP execution.

## Priority legend

- **P0:** Must ship for MVP
- **P1:** Strongly recommended for MVP hardening
- **P2:** Post-MVP

## Epic E1 - Identity and User Foundation (P0)

### Story E1-S1: User can sign up/sign in securely
- Acceptance criteria:
  - User can create account using approved auth methods.
  - Session management works across app restart.
  - Failed auth attempts return safe and actionable errors.

### Story E1-S2: User can manage profile and preferences
- Acceptance criteria:
  - User can update profile basics and notification preferences.
  - Changes persist and are reflected in alert behavior.

## Epic E2 - Search and Discovery (P0)

### Story E2-S1: User can search properties on map and list
- Acceptance criteria:
  - User can pan/zoom map and get updated results.
  - List results synchronize with map viewport.

### Story E2-S2: User can filter results by core criteria
- Acceptance criteria:
  - Price, beds, baths, and property type filters apply correctly.
  - Active filters are visible and removable.

### Story E2-S3: User sees deterministic sorting behavior
- Acceptance criteria:
  - Sorting options are consistent and documented.
  - Same input yields same order unless data changes.

## Epic E3 - Listing Details and Evaluation (P0)

### Story E3-S1: User can view complete listing details
- Acceptance criteria:
  - Media, property attributes, and key metadata load reliably.
  - Error/empty/loading states are handled.

### Story E3-S2: User can review affordability estimate
- Acceptance criteria:
  - User can input assumptions and see monthly estimate.
  - Calculation assumptions are transparent.

## Epic E4 - Save, Alert, and Re-engagement (P0)

### Story E4-S1: User can save and unsave homes
- Acceptance criteria:
  - Save state syncs across sessions/devices.
  - Saved homes list updates in near real time.

### Story E4-S2: User can save search and receive alerts
- Acceptance criteria:
  - User can create/update/delete saved searches.
  - Alerts are triggered on relevant inventory changes.

## Epic E5 - Agent Contact and Tour Scheduling (P0)

### Story E5-S1: User can contact agent from listing detail
- Acceptance criteria:
  - Contact action captures intent and routes to assigned flow.
  - Confirmation and error handling are clear.

### Story E5-S2: User can submit tour request
- Acceptance criteria:
  - User can pick preferred time windows.
  - Agent receives request with listing + user context.

## Epic E6 - Agent Lead Workflow (P0)

### Story E6-S1: Agent can view inbound lead queue
- Acceptance criteria:
  - Leads display source, listing, timestamp, and state.
  - Agent can update lead status.

### Story E6-S2: Agent response SLA telemetry exists
- Acceptance criteria:
  - Response times are captured and reportable.

## Epic E7 - Admin Operations Baseline (P1)

### Story E7-S1: Admin can flag/moderate listings
- Acceptance criteria:
  - Admin can view flagged listings and take predefined actions.
  - All moderation actions are auditable.

### Story E7-S2: Admin can monitor data quality
- Acceptance criteria:
  - Freshness and duplication indicators visible by feed/source.

## Epic E8 - Platform Security and Reliability (P0)

### Story E8-S1: RBAC and audit logging enforced
- Acceptance criteria:
  - Privileged operations require proper roles.
  - Audit events recorded for admin actions.

### Story E8-S2: Observability and alerting baseline
- Acceptance criteria:
  - Logs, metrics, traces available for core services.
  - Alert routing tested for critical conditions.

## Epic E9 - Quality and Release Governance (P0)

### Story E9-S1: Critical path e2e tests in CI
- Acceptance criteria:
  - Search -> listing -> save -> alert -> contact/tour flows are automated.
  - Release blocked on failing critical suite.

### Story E9-S2: Launch checklist and rollback validated
- Acceptance criteria:
  - Runbooks are documented and reviewed.
  - Rollback tested in staging.

## Post-MVP candidate epics (P2)

- E10: Personalized recommendations and AI ranking.
- E11: Advanced monetization products for agents.
- E12: Expanded market support and localization.
