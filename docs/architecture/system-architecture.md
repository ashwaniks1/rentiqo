# Rentiqo System Architecture

## 1. Overview

Rentiqo is a mobile-first real estate marketplace platform with supporting agent and admin operations.

The architecture follows a modular service design with clear boundaries between:
- Experience layer (mobile apps)
- Platform services (auth, listing, search, alerts, scheduling, admin)
- Data platform (ingestion, normalization, indexing, analytics)
- Operational controls (observability, security, CI/CD, incident response)

## 2. High-level component model

## Client layer
- iOS and Android apps (shared cross-platform codebase + native modules)
- Admin web console (internal operations tooling)

## Edge layer
- API gateway (routing, auth checks, request quotas, API versioning)
- CDN (listing media and static assets)
- WAF and bot/rate-limit protections

## Core services
- **Identity Service:** auth, sessions, user profiles, notification preferences
- **Listing Service:** canonical listing retrieval and listing detail composition
- **Search Service:** query parsing, filter logic, ranking, map viewport handling
- **Saved State Service:** favorites and saved searches
- **Alerts Service:** change detection and push/email alert dispatch
- **Engagement Service:** contact-agent and tour request workflows
- **Agent Service:** agent profiles, lead inbox, response workflow
- **Admin Ops Service:** moderation actions, feed quality views, audit traces

## Data services
- **Ingestion Pipeline:** external feeds (MLS/IDX and enrichment), normalization, validation
- **Canonical Data Store:** transactional persistence for users, listings, leads, moderation actions
- **Search Index:** denormalized documents optimized for low-latency discovery
- **Event Stream:** product and operational events for analytics and alert triggers
- **Warehouse/BI:** KPI tracking and reporting

## Platform and reliability
- CI/CD pipelines (build, test, security scans, deploy)
- Infrastructure as code
- Monitoring stack (logs, metrics, traces)
- Incident management and runbooks

## 3. Request and data flow

## Search flow
1. User submits query from mobile client.
2. API gateway authenticates and routes request.
3. Search service executes filter/rank query against search index.
4. Search results are hydrated with minimal canonical metadata.
5. Response returns map and list payload.

## Listing detail flow
1. Client requests listing detail by ID.
2. Listing service fetches canonical listing + derived attributes.
3. Optional enrichment (price history, neighborhood metadata) is composed.
4. Response includes media links served via CDN.

## Save and alerts flow
1. User saves home or saved search criteria.
2. Saved state service persists preferences.
3. Alerts service evaluates feed/index changes against saved criteria.
4. Matching users receive push/email notifications with dedupe protection.

## Contact and tour flow
1. User submits contact/tour request.
2. Engagement service validates and records request.
3. Agent service queues lead for assigned agent.
4. Event is tracked for analytics and SLA monitoring.

## 4. Environment model

- **Development:** rapid iteration, mocked or sampled feed data
- **Staging:** production-like infrastructure with synthetic and real integration checks
- **Production:** controlled release strategy with canary or progressive rollout

## 5. Security architecture baseline

- JWT access + refresh token rotation
- RBAC for user, agent, admin roles
- TLS everywhere
- Secrets manager for credentials and keys
- Audit logs for all privileged operations

## 6. Scalability strategy

- Horizontal scale for stateless API services
- Separate read/write patterns for high-volume listing and search operations
- Cache hot listing and filter metadata
- Asynchronous job queues for ingestion, indexing, and notification fan-out

## 7. Observability requirements

- Trace IDs propagated edge-to-core
- RED metrics (request rate, errors, duration) on critical endpoints
- Ingestion SLAs and feed lag dashboards
- Alert policies for latency, availability, and data freshness
