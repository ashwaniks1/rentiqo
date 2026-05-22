# Relevance Evaluation Plan

## Objectives

- Measure whether ranking returns actionable listings in top results.
- Establish baseline metrics before advanced ML/personalization work.

## Baseline offline metrics

- Click@3 rate
- Save conversion rate per query session
- Zero-result query rate

## Baseline online metrics

- Search to listing-detail open rate
- Listing-detail to save/contact/tour conversion
- Query reformulation rate (proxy for dissatisfaction)

## Current implementation

- Real query pipeline implemented in `services/search/src/query/listing-search.ts`
- Seeded in-memory listing dataset abstraction implemented in `services/search/src/data/listing-dataset.ts`
- Deterministic ranking implemented in `services/search/src/ranking/ranker.ts` with version label `v1-rule-based-mvp`
- Saved-search matcher now emits deterministic dedupe keys in `services/search/src/alerts/matcher.ts`
- Baseline evaluator tracks top-3 click and save occurrence signals in `services/search/src/evaluation/baseline.ts`

## Regression coverage

- `services/search/src/__tests__/ranking.test.ts`
  - deterministic ordering assertions
  - pagination cursor coverage
  - ranking version metadata assertions
- `services/search/src/__tests__/alerting-and-eval.test.ts`
  - matcher fingerprint gating coverage
  - dedupe key generation regression assertions
  - baseline evaluator signal assertions

## Next steps

1. Expand relevance signals with click/save/contact/tour engagement priors.
2. Add online event ingestion and weekly market-segment quality reports.
3. Replace in-memory dataset adapter with index-backed retrieval while preserving deterministic fallback tests.
