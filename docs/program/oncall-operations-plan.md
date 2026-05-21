# On-Call Operations Plan

## 1) Coverage model

- Primary on-call: DevSecOps/SRE
- Secondary on-call: Backend platform
- Tertiary support: Mobile + Search owners
- Program incident coordinator: Program Director

## 2) Severity and response targets

| Severity | Definition | Initial response target | Escalation |
| --- | --- | --- | --- |
| Sev-1 | Major outage / critical security/data issue | 5 minutes | Immediate executive escalation |
| Sev-2 | Significant degradation of key journeys | 15 minutes | Program + product leadership |
| Sev-3 | Limited impact issue | 60 minutes | Normal on-call escalation path |

## 3) Alert routing

- API and infra alerts -> SRE primary.
- Application errors -> backend/search primary + SRE.
- Mobile crash alerts -> mobile owner + SRE.
- Data freshness and ingestion alerts -> data owner + SRE.

## 4) Incident command flow

1. Incident commander assigned at alert acknowledgment.
2. Dedicated incident channel created with timestamped updates.
3. Mitigation owner assigned per impacted subsystem.
4. Decision log maintained until resolved.

## 5) Communication protocol

- Sev-1: updates every 15 minutes.
- Sev-2: updates every 30 minutes.
- External user updates published when user impact persists.

## 6) Post-incident obligations

- Postmortem published within agreed operational window.
- Follow-up corrective actions prioritized by severity.
- Repeated incident categories trigger architecture review.
