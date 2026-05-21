# Rentiqo Release Gates

This document defines objective entry/exit criteria for each execution stage.

## Gate 0 - Program Setup

### Entry
- Repository and branching strategy active.
- Agent workstream docs available in `docs/agents/`.

### Exit
- RAIC ownership approved (`docs/program/raic-and-ownership.md`).
- Risk register initialized (`docs/program/risk-register.md`).
- Stage gates documented (this file).

## Gate 1 - Product Definition

### Entry
- Gate 0 exit complete.

### Exit
- `docs/product/prd.md` complete and approved.
- MVP scope and non-goals frozen.
- KPI framework and backlog complete.

## Gate 2 - Architecture and UX Foundation

### Entry
- Gate 1 exit complete.

### Exit
- Architecture docs complete with service boundaries and NFRs.
- API contracts baseline complete.
- UX flow and screen specs complete for all MVP flows.

## Gate 3 - Data + Platform Core

### Entry
- Gate 2 exit complete.

### Exit
- Ingestion pipeline operational in staging with data quality metrics.
- Core backend services deployed in staging with auth + RBAC + audit logs.
- CI/CD, observability, and security baselines active.

## Gate 4 - Product Experience Build

### Entry
- Gate 3 exit complete.

### Exit
- Mobile MVP flows feature-complete.
- Search and alerting quality meets minimum KPI thresholds.
- Admin operations baseline complete.

## Gate 5 - Quality and Compliance Readiness

### Entry
- Gate 4 exit complete.

### Exit
- Critical e2e test suite green in CI.
- No unresolved critical defects.
- Privacy and licensing controls documented and reviewed.
- Incident response and rollback runbooks verified.

## Gate 6 - Production Cutover

### Entry
- Gate 5 exit complete.

### Exit (Go criteria)
- Release candidate approved by Program Director and Founder/Product Owner.
- On-call rotation active with alert routing validated.
- App store release assets complete and reviewed.
- Post-launch KPI dashboard active and monitored.

## Universal stop-ship conditions

- Unresolved critical security vulnerability.
- Non-compliance with legal/licensing obligations.
- Crash or latency metrics below release thresholds.
- Missing rollback plan for production release.
