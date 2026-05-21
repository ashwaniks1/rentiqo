# ADR 0004: Event-driven integration for async workflows

- **Status:** Accepted
- **Date:** 2026-05-21

## Context

Several workflows are asynchronous and fan-out heavy: listing ingestion, saved search alerting, analytics collection, and lead lifecycle signals.

## Decision

Use event-driven integration for asynchronous workflows with durable queues/topics.

- Synchronous APIs remain request/response for user interactions.
- Domain events are emitted for side effects and downstream processing.
- Consumers include alerts, analytics, data quality monitors, and derived view updaters.

## Consequences

## Positive
- Better decoupling between core APIs and background workloads.
- Improved resilience and backpressure handling.
- Cleaner path for future analytics and recommendation expansion.

## Negative
- Event schema governance required to avoid consumer breakage.
- Operational complexity in replay/idempotency handling.

## Follow-up actions

1. Establish event naming and schema versioning conventions.
2. Require idempotency keys for consumers that mutate state.
