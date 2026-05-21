# Rentiqo Non-Functional Requirements (NFR)

This document defines measurable non-functional requirements for MVP and launch hardening.

## 1. Performance

## API latency targets (staging load baseline)
- Search endpoint p95 <= 800ms
- Listing detail endpoint p95 <= 500ms
- Save/unsave actions p95 <= 300ms
- Contact/tour submission p95 <= 500ms

## Mobile app performance
- Cold start <= 3.0s on representative mid-tier devices
- Time to first search result <= 2.5s under normal network conditions
- Smooth map/list interaction target >= 50 FPS on common devices

## 2. Availability and reliability

- Core API availability objective: >= 99.9%
- Alert processing success rate: >= 99%
- Error budget tracked per service tier
- Retry/backoff strategy required for transient external dependencies

## 3. Scalability

- Support horizontal scale for stateless API tiers.
- Data ingestion and alert fan-out must use asynchronous workers/queues.
- Search traffic spikes should degrade gracefully with protective throttling.

## 4. Security

- TLS in transit for all public and internal service communication.
- Encryption at rest for data stores and object storage.
- JWT access tokens with short TTL and refresh rotation.
- RBAC enforcement on all protected resources.
- Audit logs for privileged and policy-sensitive actions.
- SAST/DAST and dependency scanning integrated in CI.

## 5. Privacy and compliance readiness

- Data classification for PII and sensitive fields.
- User data export/delete workflow support.
- Data retention policies by entity type and purpose.
- Consent-aware notification and communication preferences.

## 6. Observability

- Structured logging with trace and correlation IDs.
- Metrics for throughput, latency, error rates, queue lag, feed freshness.
- Distributed tracing for core user journeys.
- Alert thresholds and runbooks for all P0/P1 incidents.

## 7. Testability and quality

- Unit coverage target on core services >= 80% (excluding generated code).
- Integration tests required for cross-service critical workflows.
- Critical e2e paths in CI must pass before release.
- Contract tests required for external and internal APIs.

## 8. Operability

- Infrastructure as code for repeatable environment provisioning.
- Zero-downtime deployment strategy for core APIs.
- Backup and restore procedure documented and periodically validated.
- Incident response workflow with severity classification and postmortem process.

## 9. Compatibility and accessibility

- Mobile support policy defined for minimum OS versions.
- Accessibility baseline aligned to WCAG 2.1 AA guidance for mobile interfaces.
- Localization-ready architecture for strings and formatted data.
