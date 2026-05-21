# Rentiqo MVP Scope

This document freezes MVP boundaries to prevent scope creep during initial delivery.

## In scope (must ship)

## Consumer app
- Account creation/login and profile basics.
- Map/list search with core filters.
- Listing details with media and key property metadata.
- Save home and saved search alerts.
- Contact agent and schedule tour request.
- Affordability calculator.

## Agent workflow
- Agent profile basics.
- Lead inbox for contact/tour requests.
- Status updates for lead handling.

## Admin workflow
- Listing moderation flags and basic actioning.
- Data quality and support issue overview panel.

## Platform foundations
- Secure auth and RBAC.
- Data ingestion baseline with freshness checks.
- Search indexing and basic ranking.
- CI/CD, logging, metrics, alerting, audit logs.

## Out of scope (post-MVP)

- Full transaction management (offer, escrow, title integration).
- Nationwide multi-market launch at day one.
- End-to-end landlord property management features.
- Deep AI valuation engine and advanced personalization.
- Full desktop web parity.

## Release boundaries

## Release candidate 1
- Consumer discovery + listing detail + save.

## Release candidate 2
- Alerts + contact + tour request + agent inbox baseline.

## Release candidate 3
- Admin baseline + hardening + launch quality gates.

## Change control

- Any new feature request must be mapped to:
  - business value
  - technical impact
  - tradeoff against launch-critical scope
- Program Director approval required for scope additions.
