# Rentiqo Incident Routing Matrix

This routing matrix maps severity to responders, communication channels, and escalation deadlines.

| Severity | Trigger examples | Primary responder | Secondary responder | Escalation deadline | Channel(s) |
| --- | --- | --- | --- | --- | --- |
| Sev-1 | Full outage, critical security event, data corruption | DevSecOps/SRE on-call | Program Director + Backend on-call | Immediate (0-5 minutes) | Pager escalation + incident bridge + exec updates |
| Sev-2 | Significant degradation for core journeys | DevSecOps/SRE on-call | Service owner on-call | 15 minutes | On-call channel + status updates every 30 minutes |
| Sev-3 | Localized issue or non-critical service instability | Service owner on-call | DevSecOps/SRE | 60 minutes | Team channel + normal incident tracker |

## Routing rules

1. Any security event with suspected credential compromise is treated as Sev-1.
2. Incidents impacting release gates or error budgets are escalated to DevSecOps/SRE.
3. Customer-facing incidents require Program Director visibility for communication alignment.

## Handoff requirements during active incidents

- Incident commander records timeline checkpoints every update interval.
- Mitigation owner and comms owner must be explicitly assigned.
- Recovery is not declared until SLO checks in `docs/devops/observability-and-slos.md` return to baseline.
