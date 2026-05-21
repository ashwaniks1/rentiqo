# Rentiqo Data Source Inventory

This document defines the source strategy for listing, enrichment, and operational reference data.

## 1) Source classes

## Primary listing sources
- MLS/IDX provider feeds for launch market(s)
- Broker direct listing submissions (future expansion)

## Enrichment sources
- Geocoding and map metadata provider
- School district and zoning datasets
- Neighborhood POI and commute metadata

## Operational reference sources
- Agent verification/license reference datasets
- Postal/address normalization reference tables

## 2) Launch strategy by maturity

| Source class | MVP status | Notes |
| --- | --- | --- |
| MLS/IDX launch market feed | Required | Contract and compliance obligations must be signed before ingestion |
| Map/geocoding provider | Required | Needed for map search, reverse geocoding, and viewport logic |
| Neighborhood enrichment | Recommended | Can be partial in MVP if clearly labeled |
| Agent verification data | Recommended | Supports trust and moderation workflows |

## 3) Source onboarding checklist

1. Legal/licensing agreement signed.
2. Technical feed spec reviewed and mapped to canonical schema.
3. Data usage and attribution obligations documented.
4. PII and retention implications reviewed with compliance.
5. Initial backfill and delta cadence tested in staging.

## 4) Source metadata contract

Each source must include:
- `source_provider_id`
- schema version
- delivery mechanism
- expected update cadence
- timezone and timestamp semantics
- record identity fields
- deprecation/change notification process

## 5) Source risk notes

- MLS/IDX policy changes can affect retention and display rules.
- Inconsistent provider timestamps can degrade freshness metrics.
- Address normalization quality directly impacts dedupe and map precision.

## 6) Ownership

- Data onboarding: Data Partnerships and Ingestion Agent
- Compliance validation: Compliance and Legal Agent
- Operational monitoring: DevSecOps/SRE + Data Ingestion Agent
