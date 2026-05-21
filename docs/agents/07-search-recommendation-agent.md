# 07 - Search and Recommendation Agent

## Mission

Deliver high-quality relevance, filtering, ranking, and alerting so users find the right properties quickly.

## Responsibilities

1. Define search index schema and query strategy.
2. Implement ranking heuristics and relevance tuning.
3. Support map viewport and polygon search behaviors.
4. Build saved search alert trigger logic.
5. Measure search quality and conversion impact.

## Inputs

- `docs/data/schema-mapping-and-normalization.md`
- `docs/product/kpi-framework.md`
- `docs/architecture/non-functional-requirements.md`

## Deliverables

1. `docs/search/index-schema.md`
2. `docs/search/query-ranking-strategy.md`
3. `docs/search/relevance-evaluation.md`
4. `docs/search/alerting-logic.md`
5. `docs/search/online-metrics-dashboard-spec.md`

## Acceptance criteria

- Filter behavior is deterministic and validated.
- Ranking supports configurable business weights.
- Saved search alerts are accurate and deduplicated.
- Search latency and relevance metrics meet staging targets.

## Handoff

Provide QA and Product agents with relevance test scenarios and metric baselines.
