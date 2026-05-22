# Rentiqo Observability and SLOs

## 1) Observability stack requirements

- Structured logs (JSON) with correlation IDs.
- Metrics for service health and user-facing quality.
- Distributed tracing across gateway, services, and asynchronous workers.
- Centralized alert management with severity routing.

## 2) Service level indicators (SLIs)

## Availability SLIs
- API successful response rate for core endpoints
- Alert dispatch success ratio

## Latency SLIs
- p95 response latency for search and listing detail
- Queue processing latency for alerts and ingestion updates

## Data quality SLIs
- Listing freshness compliance
- Duplicate listing ratio

## 3) Initial SLO targets (MVP baseline)

- Core API availability >= 99.9%
- Search endpoint p95 <= 800ms
- Listing detail p95 <= 500ms
- Alert processing success >= 99%
- Data freshness compliance >= 95%

## 4) Alert policy

- Sev-1: user-facing outage or critical data correctness issue
- Sev-2: degraded performance with notable user impact
- Sev-3: localized or low-impact issues

Alert rules must map to runbooks and on-call owners.

## 5) Dashboards

Required dashboard groups:
1. API health (latency, errors, throughput)
2. Mobile API consumption quality
3. Ingestion pipeline and data quality
4. Notification/alert delivery health
5. Infrastructure saturation and capacity

## 6) Automated observability gate enforcement

Observability gates are codified in `docs/devops/observability-gate-checks.md` and enforced by:

- `.github/workflows/ci.yml`
- `.github/workflows/staging-deploy.yml`
- `scripts/release/check-observability-gates.sh`

Release candidates do not advance when any required observability artifact or gate fails.

## 7) Incident routing linkage

Severity escalation and responder assignments are documented in:

- `docs/devops/incident-routing-matrix.md`
- `docs/devops/incident-response-runbook.md`
- `docs/program/oncall-operations-plan.md`

## 8) Error budget policy

- Track monthly error budget consumption by service tier.
- Freeze risky deploys when budget burn exceeds threshold.
- Require incident review before resuming normal release velocity.
