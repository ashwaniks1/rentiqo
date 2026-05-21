# Search Index Schema (Stage 4 Baseline)

Canonical index document fields:

- `listing_id` (keyword)
- `source_provider` (keyword)
- `status` (keyword)
- `price` (numeric)
- `beds` (numeric)
- `baths` (numeric)
- `property_type` (keyword)
- `city`, `state`, `postal_code` (keyword/text as needed)
- `location` (geo_point)
- `updated_at` (date)

Optional enrichment fields:
- `has_price_reduction` (boolean)
- `days_on_market` (numeric)
- `school_score` (numeric)

## Indexing principles

1. Keep filter-critical fields typed and exact-match friendly.
2. Separate text and keyword field usage for consistent sorting/filtering.
3. Maintain versioned index templates for controlled migrations.
