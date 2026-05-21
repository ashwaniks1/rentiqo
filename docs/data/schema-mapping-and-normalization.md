# Rentiqo Schema Mapping and Normalization

This document defines mapping from external source records to the canonical listing schema.

## 1) Canonical listing schema (MVP core)

### Identity
- `listing_id` (internal immutable ID)
- `source_provider`
- `external_source_id`

### Location
- `street_address`
- `city`
- `state`
- `postal_code`
- `latitude`
- `longitude`

### Property characteristics
- `property_type`
- `beds`
- `baths`
- `interior_area_sqft`
- `lot_area_sqft`
- `year_built`

### Commercial terms
- `listing_status`
- `list_price`
- `rent_price`
- `hoa_fee_monthly`

### Metadata
- `source_updated_at`
- `ingested_at`
- `media_assets`
- `description`

## 2) Mapping standards

- Source adapters map raw fields to canonical schema using explicit field map tables.
- Unknown source attributes are captured in extensible metadata object for forward compatibility.
- Every mapped record must include source provenance fields.

## 3) Normalization rules

1. **Currency normalization**
   - Store monetary values in normalized numeric format with currency code.

2. **Unit normalization**
   - Convert all area measurements to square feet for canonical storage.
   - Preserve source unit metadata for audit.

3. **Address normalization**
   - Standardize abbreviations and casing.
   - Attempt geocode validation when coordinates missing or suspect.

4. **Status normalization**
   - Map source-specific statuses to canonical enum:
     - active, pending, sold, rented, off_market

5. **Date normalization**
   - Convert timestamps to UTC with source timezone preserved in metadata.

## 4) Duplicate resolution policy

Match keys in priority order:
1. `source_provider + external_source_id`
2. normalized address + high geospatial confidence
3. address + listing characteristic similarity

Merge behavior:
- Highest confidence source for status and price wins unless source priority policy overrides.
- Preserve conflicting values in lineage metadata.

## 5) Validation rules

- Mandatory fields: identity, location, status, at least one price field.
- Price/area bounds must fall within configurable sanity limits.
- Missing or invalid mandatory fields route to quality queue with rejection reason.

## 6) Change event schema (for downstream services)

Required event fields:
- `event_id`
- `event_type`
- `listing_id`
- `source_provider`
- `changed_fields`
- `event_timestamp`
- `record_version`

Events must be idempotent and versioned.
