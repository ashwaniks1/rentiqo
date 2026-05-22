# Post-Launch KPI Dashboard

## Dashboard objective

Track product health, marketplace quality, growth efficiency, and monetization performance in one operational view.

## 1) Product funnel widgets

- Installs and signup conversion
- First-search activation rate
- Search -> listing detail CTR
- Save/contact/tour conversion rates

## 2) Marketplace quality widgets

- Listing freshness SLA compliance
- Duplicate listing rate
- Agent response SLA compliance
- Zero-result query rate

## 3) Reliability widgets

- API availability
- Search/listing latency p95
- Mobile crash-free sessions

## 4) Revenue and growth widgets

- Lead product adoption (agents)
- Revenue by stream and segment
- CAC and retention trend
- LTV proxy indicators (engagement and repeated conversion actions)

## 5) Alert thresholds

- Conversion drop beyond agreed baseline deviation
- Data quality SLA breach
- Reliability SLO breach
- Revenue guardrail breaches for active experiments

## 6) Instrumentation mapping (implementation baseline)

| Event name | Source surface | KPI linkage |
| --- | --- | --- |
| `auth_login_success` | Mobile auth flow | Activation rate |
| `search_query_submitted` | Mobile discover/search | Search volume, zero-result rate |
| `listing_detail_opened` | Mobile listing detail | Search -> detail CTR |
| `home_saved` | Mobile save action | Save conversion |
| `contact_agent_submitted` | Mobile contact flow | Lead conversion |
| `tour_request_submitted` | Mobile tour flow | High-intent conversion |
| `alert_match_generated` | Search/alerts pipeline | Alert relevance and delivery quality |
| `api_error_rate_spike` | Backend observability | Reliability guardrails |

## 7) Ownership

- Product/Growth: conversion and engagement KPIs
- Backend/Search: event emission integrity and schema stability
- DevSecOps/SRE: reliability and alert signal operationalization
