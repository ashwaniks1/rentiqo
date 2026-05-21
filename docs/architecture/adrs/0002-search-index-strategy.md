# ADR 0002: Search index strategy

- **Status:** Accepted
- **Date:** 2026-05-21

## Context

Property discovery depends on low-latency map and filter queries that are difficult to serve directly from normalized transactional tables at scale.

## Decision

Use a denormalized search index as the primary read model for listing discovery while retaining canonical listing records in the transactional datastore.

- Canonical data store is source of truth.
- Search index is eventually consistent and optimized for query performance.
- Ingestion and change events update index asynchronously.

## Consequences

## Positive
- Predictable low-latency query performance for complex filters.
- Better support for relevance tuning and map viewport search.
- Scalable read path under traffic spikes.

## Negative
- Eventual consistency between canonical store and search index.
- Additional operational complexity for index rebuilds/replays.

## Follow-up actions

1. Define index schema and update strategy in `docs/search/index-schema.md`.
2. Implement feed lag and index freshness monitoring.
