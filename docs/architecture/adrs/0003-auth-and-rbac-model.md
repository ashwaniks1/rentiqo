# ADR 0003: Authentication and RBAC model

- **Status:** Accepted
- **Date:** 2026-05-21

## Context

Rentiqo handles user accounts, agent workflows, and privileged admin operations. Security controls must support least privilege and auditability for enterprise readiness.

## Decision

Adopt JWT-based auth with refresh token rotation and role-based access control.

- Short-lived access tokens for API authorization.
- Rotating refresh tokens with server-side revocation support.
- Role scopes: consumer, agent, admin.
- Authorization checks at API gateway and service layers.
- Mandatory audit events for privileged admin actions.

## Consequences

## Positive
- Clear role boundaries and enforceable least-privilege design.
- Better breach containment through short access-token lifespan.
- Auditable privileged action trail for compliance readiness.

## Negative
- Token rotation and revocation add implementation overhead.
- Role migration paths require careful change management.

## Follow-up actions

1. Document endpoint-level authorization matrix in backend service docs.
2. Add automated authorization tests for privileged endpoints.
