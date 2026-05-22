# Rentiqo Incident Response Runbook

## 1) Incident lifecycle

1. Detection
2. Triage
3. Mitigation
4. Recovery
5. Postmortem

## 2) Severity model

- **Sev-1:** major outage, security incident, or critical data corruption
- **Sev-2:** significant degradation affecting key journeys
- **Sev-3:** limited impact or non-critical subsystem issue

## 3) Initial response checklist

- [ ] Acknowledge alert and assign incident commander.
- [ ] Open incident channel and timeline log.
- [ ] Confirm scope (services, regions, user segments).
- [ ] Apply immediate mitigation if clear and safe.
- [ ] Communicate status update cadence.

## 4) Communication protocol

- Internal updates every 15 minutes for Sev-1, every 30 minutes for Sev-2.
- Product owner and program owner included in high-severity incidents.
- External/user communication triggered when user impact is sustained.

## 5) Recovery checklist

- [ ] Service metrics return to baseline.
- [ ] Backlog/queue drains to normal levels.
- [ ] Data quality validation checks pass.
- [ ] Monitoring confirms sustained stability.

## 6) Postmortem template requirements

- Incident summary and impact
- Timeline with detection gap analysis
- Root cause and contributing factors
- What went well / what failed
- Action items with owners and due criteria

## 7) Drills and readiness

- Quarterly incident simulation for:
  - API outage
  - ingestion failure
  - notification pipeline delay
  - credential/key compromise scenario

## 8) Routing and escalation artifacts

- Severity routing matrix: `docs/devops/incident-routing-matrix.md`
- On-call ownership and rotation: `docs/program/oncall-operations-plan.md`
- Observability gate expectations: `docs/devops/observability-gate-checks.md`
