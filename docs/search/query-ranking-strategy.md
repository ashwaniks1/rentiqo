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

1. Stage 4 baseline: rule-based scoring (`services/search/src/ranking/ranker.ts`)
2. Stage 5+: add engagement-based re-ranking (click/save/tour feedback)

## Guardrails

- Enforce deterministic output for identical input state.
- Expose ranking version in debug metadata for observability.
