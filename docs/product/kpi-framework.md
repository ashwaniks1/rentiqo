# Rentiqo KPI Framework

This KPI framework defines measurable outcomes for acquisition, activation, engagement, conversion, retention, quality, and reliability.

## 1) North-star metric

- **Qualified engagement rate:** percentage of active users who perform at least one high-intent action (save home, create alert, contact agent, schedule tour) within a defined period.

## 2) Funnel metrics

## Acquisition
- App installs (organic + paid by channel)
- Cost per install (CPI)
- Signup conversion from install

## Activation
- Time to first search
- Time to first listing detail view
- First-session completion of saved preference setup

## Engagement
- DAU/WAU ratio
- Searches per active user
- Listing detail views per active user
- Homes saved per active user

## Conversion
- Saved search creation rate
- Contact-agent initiation rate
- Tour request submission rate
- Agent response time (median)

## Retention
- D1, D7, D30 retention
- Returning user search frequency
- Alert-open and re-engagement rate

## 3) Marketplace quality metrics

- Listing freshness SLA compliance rate
- Duplicate listing rate
- Data completeness score for listings
- Search zero-result rate

## 4) Platform reliability and quality metrics

- Search API p95 latency
- Listing detail API p95 latency
- Core API availability
- Mobile crash-free sessions
- Release defect escape rate

## 5) Initial target thresholds (MVP beta baseline)

These are initial targets for launch-readiness decisions and should be tuned with real beta data.

- Search API p95 <= 800ms
- Listing detail API p95 <= 500ms
- API availability >= 99.9%
- Crash-free sessions >= 99.5%
- Listing freshness SLA >= 95% in launch market
- Duplicate listing rate <= 2%

## 6) Measurement and ownership

| Metric family | Primary owner | Supporting owners |
| --- | --- | --- |
| Acquisition/Activation | Growth Agent | Product + Mobile |
| Engagement/Conversion | Product Manager Agent | Mobile + Backend + Search |
| Marketplace quality | Data Ingestion Agent | Search + Admin Ops |
| Reliability/Quality | DevSecOps + QA Agents | Backend + Mobile |

## 7) Reporting cadence

- Daily: reliability and data quality metrics.
- Weekly: funnel and engagement trends.
- Per release: regression against baseline thresholds.
