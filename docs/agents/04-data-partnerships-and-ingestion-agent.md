# 04 - Data Partnerships and Ingestion Agent

## Mission

Build trusted property data pipelines and keep listing inventory accurate, fresh, and deduplicated.

## Responsibilities

1. Define external data source strategy (MLS/IDX/third-party enrichment).
2. Build ingestion architecture and schema mapping.
3. Implement normalization, deduplication, and validation rules.
4. Establish data freshness and quality SLAs.
5. Create monitoring for feed failures and drift.

## Inputs

- `docs/architecture/domain-model.md`
- `docs/architecture/system-architecture.md`
- Product requirements for listing/search experience

## Deliverables

1. `docs/data/data-source-inventory.md`
2. `docs/data/ingestion-architecture.md`
3. `docs/data/schema-mapping-and-normalization.md`
4. `docs/data/data-quality-slas.md`
5. `docs/data/feed-operations-runbook.md`

## Acceptance criteria

- Canonical listing schema defined and versioned.
- Duplicate resolution rules documented and testable.
- Freshness monitoring and alert thresholds in place.
- Backfill and replay strategy documented.

## Handoff

Provide canonical schema + quality contracts to Backend and Search agents.
