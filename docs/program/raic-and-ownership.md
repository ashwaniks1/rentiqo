# Rentiqo RAIC and Ownership Matrix

This document defines execution ownership for the multi-agent delivery system.

> Note: The file name follows the previously defined deliverable path (`raic-and-ownership.md`).

## Role definitions

- **R (Responsible):** Executes work and produces deliverables.
- **A (Accountable):** Final approver and owner of outcome quality.
- **I (Informed):** Must be notified of status, decisions, and risks.
- **C (Consulted):** Intentionally omitted from this RAIC model to keep agent handoffs deterministic.

## RAIC matrix by workstream

| Workstream | Responsible | Accountable | Informed |
| --- | --- | --- | --- |
| Program orchestration | Program Director Agent | Founder/Product Owner | All agents |
| Product requirements and scope | Product Manager Agent | Program Director Agent | Architecture, UX, Backend, Mobile |
| Architecture and ADRs | Solution Architect Agent | Program Director Agent | Backend, Mobile, DevSecOps |
| UX and design system | UX/UI Agent | Product Manager Agent | Mobile, QA |
| Data partnerships and ingestion | Data Partnerships & Ingestion Agent | Program Director Agent | Backend, Search, Compliance |
| Backend platform and APIs | Backend Platform Agent | Solution Architect Agent | Mobile, QA, DevSecOps |
| Mobile implementation | Mobile App Agent | Product Manager Agent | QA, Growth |
| Search and recommendation | Search & Recommendation Agent | Solution Architect Agent | Product, Mobile |
| QA and test automation | QA & Test Automation Agent | Program Director Agent | All delivery agents |
| DevSecOps and SRE | DevSecOps & SRE Agent | Program Director Agent | Backend, Mobile, QA |
| Compliance and legal | Compliance & Legal Agent | Founder/Product Owner | Program, Security, Data |
| Growth and monetization | Growth & Monetization Agent | Product Manager Agent | Backend, Mobile, Analytics |

## Decision ownership map

| Decision area | Decision owner | Approval required |
| --- | --- | --- |
| MVP scope changes | Product Manager Agent | Program Director Agent |
| Architecture deviations | Solution Architect Agent | Program Director Agent |
| Security exception | DevSecOps & SRE Agent | Program Director + Founder |
| Compliance exception | Compliance & Legal Agent | Founder/Product Owner |
| Release go/no-go | Program Director Agent | Founder/Product Owner |

## Escalation chain

1. Responsible agent attempts mitigation and logs risk in `docs/program/risk-register.md`.
2. If unresolved, escalate to Program Director Agent within same stage.
3. If stage gate or compliance impact exists, escalate to Founder/Product Owner for decision.

## Operating rules

- Each stage ends with a documented handoff.
- No downstream execution begins without upstream acceptance criteria marked complete.
- Any blocked critical path item must include a fallback plan before stage closure.
