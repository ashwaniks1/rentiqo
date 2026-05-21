# SOC2 Readiness Gap Assessment (Initial)

## Scope

Initial readiness snapshot against common SOC2 trust criteria control areas.

## Current strengths

- Security baseline controls documented (`docs/security/security-baseline-controls.md`).
- Incident response and operational runbooks documented.
- CI quality gate baseline and automated tests introduced.
- Audit log expectations captured in architecture and backend docs.

## Gaps to address

| Control area | Current state | Gap | Priority |
| --- | --- | --- | --- |
| Access governance | Partial | Need periodic access review execution evidence | High |
| Change management | Partial | Need formal approval/evidence workflow tied to releases | High |
| Vendor risk management | Partial | Need processor due diligence records and review cadence | Medium |
| Data retention enforcement | Partial | Need automated purge jobs + verification evidence | High |
| Security monitoring | Partial | Need centralized SIEM workflow and triage SOP evidence | High |
| Business continuity | Partial | Need tested DR exercise evidence and outcomes | High |
| Policy governance | Partial | Need versioned policy review schedule with approvals | Medium |

## Recommended remediation plan

1. Implement control evidence collection pipeline (tickets, logs, approvals).
2. Formalize access review and least-privilege recertification cadence.
3. Execute and record DR tabletop + recovery simulation.
4. Add compliance dashboard tracking control status by owner.
