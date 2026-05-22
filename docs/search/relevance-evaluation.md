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

- Query pipeline implemented in `services/search/src/query/query-engine.ts`
- Ranking baseline implemented in `services/search/src/ranking/ranker.ts` with version `rule-v2`
- Alert matcher with dedupe key support in `services/search/src/alerts/matcher.ts`
- Relevance evaluator in `services/search/src/evaluation/baseline.ts` now outputs conversion score

## Local baseline evidence (latest run)

- Command: `npm test`
- Search test suite status: pass
- Observed checks:
  - ranking ordering behavior validated
  - filter + query pipeline behavior validated
  - alert matcher notify/dedupe behavior validated
  - baseline relevance click-at-top3 + conversion score validated

## Next steps

1. Add live event ingestion for click/save/contact/tour outcomes.
2. Produce staging query-level relevance report against realistic traffic slices.
3. Add threshold-based regression alarms tied to zero-result and conversion drops.
