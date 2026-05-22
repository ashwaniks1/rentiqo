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

- Baseline evaluator now emits deterministic per-query click/save signals in `services/search/src/evaluation/baseline.ts`.
- Metric summarizer emits aggregate rates for `clickAtTop3Rate`, `saveRate`, and `zeroResultRate`.
- Regression fixtures validate ranking determinism and matcher dedupe behavior in `services/search/src/__tests__/*`.

## Measured baseline (2026-05-22 UTC)

Measured from the deterministic regression fixture in `services/search/src/__tests__/alerting-and-eval.test.ts`:

| Metric | Baseline value |
| --- | --- |
| Sample queries | 2 |
| Click@3 rate | 0.50 |
| Save conversion rate | 0.50 |
| Zero-result query rate | 0.50 |
| Click signal count | 1 |
| Save signal count | 1 |

Interpretation:
- Ranking and evaluation outputs are now versionable and repeatable for identical input state.
- Baseline values are fixture-driven and suitable for regression detection, not production KPI targets.

## Next steps

1. Connect live search event ingestion so production click/save/tour signals feed the same metric schema.
2. Expand fixture suite with market-segment slices (urban/suburban/luxury) for trend tracking.
3. Publish weekly relevance report that compares fixture drift and online conversion drift.
