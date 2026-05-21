# Rentiqo Backend Service Catalog (Stage 3 Baseline)

This catalog defines MVP backend services, ownership boundaries, and core responsibilities.

## 1) API Gateway

- Routes versioned APIs.
- Enforces authentication checks and request rate limits.
- Injects correlation IDs for traceability.

## 2) Identity Service

- User registration, login, token refresh.
- Profile and preference management.
- Role/permission claims issuance.

## 3) Listing Service

- Listing detail retrieval from canonical model.
- Listing history access.
- Data composition for UI-ready listing payloads.

## 4) Search Service

- Search query validation and normalization.
- Filter execution and ranking via search index.
- Map viewport and polygon query support.

## 5) Saved State Service

- Save/unsave homes.
- Create/update/delete saved searches.
- Fetch saved homes/searches for users.

## 6) Alerts Service

- Evaluate listing changes against saved searches.
- Deduplicate notifications.
- Dispatch push/email notifications and track delivery outcomes.

## 7) Engagement Service

- Contact-agent request creation.
- Tour request creation and state management.
- User inbox summary APIs.

## 8) Agent Service

- Agent profile retrieval and updates.
- Agent lead queue APIs.
- Lead status transitions and SLA timestamps.

## 9) Admin Ops Service

- Moderation case management.
- Data quality summary APIs.
- Audit evidence access for internal operations.

## 10) Event and Analytics Service (supporting)

- Ingests domain events.
- Publishes analytics streams.
- Supports metric and KPI aggregation.

## Ownership summary

| Service | Primary owner |
| --- | --- |
| API Gateway | Backend Platform + DevSecOps |
| Identity | Backend Platform |
| Listing | Backend Platform |
| Search | Search and Recommendation Agent |
| Saved State | Backend Platform |
| Alerts | Backend Platform + Search |
| Engagement | Backend Platform |
| Agent | Backend Platform |
| Admin Ops | Backend Platform |
| Event/Analytics | Backend + Growth/Data |
