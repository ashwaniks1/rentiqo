# Query and Ranking Strategy

## Query behavior (MVP)

- Must support map viewport and optional polygon constraints.
- Apply hard filters first (status, price, beds, baths, type).
- Return deterministic sorted results by ranking score then stable tie-breakers.

## Baseline ranking inputs

- Listing status (active preferred)
- Price fit relative to user filter range
- Bedroom/bathroom fit
- Freshness recency signal

## Ranking model phases

1. Stage 4 baseline: rule-based scoring (`services/search/src/ranking/ranker.ts`, version `v1-rule-based-20260522`)
2. Stage 5+: add engagement-based re-ranking (click/save/tour feedback)

## Guardrails

- Enforce deterministic output for identical input state.
- Expose ranking version in debug metadata for observability.
- Use stable tie-breakers (`score`, `price`, `beds`, `baths`, `listingId`) to avoid nondeterministic ordering.

## Implemented query pipeline

- `services/search/src/query/pipeline.ts` now applies hard filters (`minPrice`, `maxPrice`, `minBeds`, `minBaths`) before ranking.
- Pipeline response includes filter metadata, candidate counts, and ranking version for baseline monitoring.
