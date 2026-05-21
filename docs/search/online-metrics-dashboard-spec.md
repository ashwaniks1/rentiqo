# Search Online Metrics Dashboard Spec

## Dashboard sections

1. Query traffic and latency
2. Result quality and conversion
3. Alert pipeline quality
4. Data freshness impact on search

## Required widgets

- Query volume by hour/day
- p50/p95 search latency
- Zero-result rate trend
- Listing detail click-through rate
- Save/contact/tour conversion from search
- Alert match count and delivery success rate
- Index lag and freshness compliance overlay

## Alert thresholds

- p95 latency above budget for sustained interval
- Zero-result rate spike above baseline
- Alert delivery success below 99%
- Index lag above freshness threshold

## Ownership

- Primary: Search and Recommendation Agent
- Supporting: Data Ingestion, Backend, DevSecOps/SRE
