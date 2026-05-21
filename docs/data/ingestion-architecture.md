# Rentiqo Ingestion Architecture

## 1) Objectives

- Ingest listing data reliably from external providers.
- Normalize into canonical schema for serving and search.
- Track freshness, quality, and drift in near real time.
- Support replay/backfill without data corruption.

## 2) Pipeline stages

1. **Source intake**
   - Pull or receive source feed files/events.
   - Persist immutable raw payload in object storage.
   - Record feed manifest metadata.

2. **Schema parsing**
   - Parse source payloads against source-specific adapters.
   - Validate mandatory source fields and types.
   - Emit parse errors to quality queue.

3. **Canonical normalization**
   - Map source fields to canonical listing model.
   - Apply unit normalization (currency, area units, date format).
   - Standardize location and address fields.

4. **Entity resolution and dedupe**
   - Match records by source IDs, address, and geospatial similarity.
   - Merge policy with deterministic precedence rules.
   - Write linkage metadata for auditability.

5. **Validation and quality checks**
   - Required-field completeness checks.
   - Value sanity checks (price/area bounds).
   - Policy checks (status transitions, date order).

6. **Persistence and publication**
   - Upsert canonical records into transactional store.
   - Publish change events to indexing and alert pipelines.
   - Emit ingestion metrics.

## 3) Data flow topology

- Source adapters -> raw landing bucket -> parser workers -> normalizer workers
- Normalizer output -> canonical DB writer + quality monitor
- Change events -> search index updater + alert matcher + analytics stream

## 4) Failure handling

- Poison record isolation queue for malformed payloads.
- Retry with exponential backoff for transient dependencies.
- Circuit breaker for persistent source failures.
- Replay pipeline for corrected adapter logic.

## 5) Replay and backfill strategy

- Raw source data is immutable and retained per policy.
- Backfill jobs can rerun parser/normalization stages for selected date/source windows.
- Replays are idempotent via record version and upsert semantics.

## 6) Operational metrics

- Feed intake lag
- Parse failure rate by source
- Normalization error rate
- Canonical upsert throughput
- Index propagation lag
- End-to-end freshness lag

## 7) Security and compliance controls

- Source credentials stored in secret manager.
- Access controls for raw and canonical stores by least privilege.
- Data-attribution and retention rules enforced at ingestion boundary.
