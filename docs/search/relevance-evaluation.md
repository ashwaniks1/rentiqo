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

- Baseline evaluator scaffold in `services/search/src/evaluation/baseline.ts`
- Tracks top-3 click and save occurrence signals

## Next steps

1. Add synthetic test fixtures for ranking regression checks.
2. Instrument live event collection for click/save/tour events.
3. Add weekly relevance quality report by market segment.
