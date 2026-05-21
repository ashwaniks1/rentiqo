# Rentiqo Data Quality SLAs

This document defines measurable quality objectives for listing data in the launch market.

## 1) SLA dimensions

1. Freshness
2. Completeness
3. Accuracy (proxy)
4. Duplication
5. Pipeline reliability

## 2) SLA targets (MVP launch baseline)

| Dimension | Metric | Target | Measurement window |
| --- | --- | --- | --- |
| Freshness | Active listings updated within expected source cadence | >= 95% | Rolling 24h |
| Completeness | Listings with all mandatory fields populated | >= 98% | Rolling 24h |
| Duplication | Duplicate active listings as percentage of active inventory | <= 2% | Rolling 24h |
| Pipeline reliability | Successful ingestion runs per schedule | >= 99% | Rolling 7d |
| Error response | Critical ingestion incident acknowledgement time | <= 15 min | Per incident |

## 3) Alert thresholds

- Freshness drops below 93%: page on-call data owner.
- Duplicate rate exceeds 3%: create incident and pause dependent alert fan-out if needed.
- Pipeline success falls below 98% over 24h: initiate incident triage.

## 4) KPI ownership

- Primary owner: Data Ingestion Agent
- Supporting owners: DevSecOps/SRE, Search Agent, Admin Ops

## 5) Reporting requirements

- Daily dashboard for quality metrics by source.
- Weekly quality trend review with root-cause analysis for major deviations.
- Stage gate evidence export required before launch go/no-go.

## 6) Remediation policy

- Critical SLA breach requires incident ticket with:
  - source(s) impacted
  - user-impact scope
  - mitigation timeline
  - preventive follow-up action
