# Rentiqo Product Requirements Document (PRD)

## 1. Product overview

Rentiqo is a Zillow-like mobile-first real estate marketplace for buyers and renters, with integrated workflows for agents and admin operations.

The product helps users discover, evaluate, and take action on properties through:
- Map-first search and filters
- Deep listing insights and history
- Saved homes/search alerts
- Tour scheduling and agent contact
- Affordability decision tools

## 2. Problem statement

Home search experiences are fragmented: discovery, valuation confidence, agent coordination, and decision workflows live across multiple disconnected tools.

Rentiqo unifies these workflows in one production-grade platform.

## 3. Goals and non-goals

## Goals (MVP)

1. Deliver reliable property discovery in one launch market.
2. Provide accurate listing details with freshness monitoring.
3. Enable user conversion actions: save, alert, schedule tour, contact agent.
4. Build enterprise operational baseline (security, observability, QA gates).

## Non-goals (MVP)

- Full transaction closing workflow (offers, escrow, title) end-to-end.
- Nationwide rollout and multi-region optimization.
- Advanced AI valuation models beyond baseline affordability tooling.
- Desktop web parity for all consumer flows.

## 4. Personas

1. **Buyer (primary):** Looking to purchase a home; needs search confidence and fast coordination.
2. **Renter (secondary):** Needs fast filtering, availability, affordability comparison.
3. **Agent/Broker:** Needs lead quality, listing performance, and scheduling efficiency.
4. **Admin/Operations:** Needs moderation, data quality and operational visibility.

Detailed persona docs: `docs/product/personas-and-jobs-to-be-done.md`

## 5. Core user journeys

1. User signs up and sets preferred search area.
2. User searches map/list with filters and opens listing detail.
3. User saves homes and creates saved search alerts.
4. User schedules a tour and contacts agent.
5. Agent manages inbound leads and tour requests.
6. Admin monitors listing quality and support requests.

## 6. Functional requirements (MVP)

### FR-01 Authentication and profile
- Email/social sign-up and sign-in.
- Profile with search preferences and notification controls.

### FR-02 Search and discovery
- Map + list results.
- Filters: price, beds, baths, property type, status, size.
- Sort and pagination/infinite scroll.

### FR-03 Listing details
- Media gallery, core details, price history, basic neighborhood context.
- Days on market and key property attributes.

### FR-04 Save and alerts
- Save/unsave home.
- Save search and receive push/email alerts on new/changed matches.

### FR-05 Conversion workflows
- Contact agent (message/call intent tracking).
- Tour scheduling request flow.

### FR-06 Affordability tools
- Mortgage calculator.
- Monthly payment estimate with taxes/fees inputs.

### FR-07 Agent workflow baseline
- Agent profile and verification tag support.
- Lead queue for contacts/tour requests.

### FR-08 Admin baseline
- Listing moderation and issue flagging.
- Basic operations dashboard.

## 7. Non-functional requirements (MVP)

- Search API p95 latency target <= 800ms in staging load tests.
- Listing detail API p95 <= 500ms.
- Mobile crash-free sessions target >= 99.5% pre-launch.
- Availability objective: 99.9% for core APIs after launch.
- Full audit logs for privileged admin actions.

## 8. Dependencies

- Data providers/MLS-IDX contracts by launch geography.
- Map provider integration and quota management.
- Push notification service integration.
- Compliance policy baseline for privacy and retention.

## 9. Risks

See `docs/program/risk-register.md` for tracked risks and mitigations.

## 10. Release strategy

1. Internal alpha (team validation).
2. Closed beta in one launch market with invited users/agents.
3. Public launch with controlled acquisition.
4. Post-launch hardening and KPI-driven iteration.

## 11. Success metrics

See `docs/product/kpi-framework.md`.

## 12. Open questions

1. Initial launch geography and data source finalization.
2. First revenue model to prioritize (promoted listings vs subscriptions).
3. Scope of neighborhood data in MVP (internal vs third-party enrichment).
