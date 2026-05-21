# Rentiqo Agent Delivery System

This folder defines how Cursor automation agents can build an enterprise-grade Zillow-like platform end-to-end.

## Goal

Build and launch **Rentiqo** (iOS + Android + backend + admin) with production-grade quality, security, reliability, and operations.

## How to use these docs

1. Start with `00-program-director-agent.md`.
2. Execute agents in the order defined in `execution-plan.md`.
3. Each agent must produce the artifacts listed in its own `.md` file.
4. The Program Director validates acceptance criteria before moving to the next stage.

## Agent catalog

- `00-program-director-agent.md`
- `01-product-manager-agent.md`
- `02-solution-architect-agent.md`
- `03-ux-ui-agent.md`
- `04-data-partnerships-and-ingestion-agent.md`
- `05-backend-platform-agent.md`
- `06-mobile-app-agent.md`
- `07-search-recommendation-agent.md`
- `08-qa-test-automation-agent.md`
- `09-devsecops-sre-agent.md`
- `10-compliance-legal-agent.md`
- `11-growth-monetization-agent.md`
- `execution-plan.md`
- `deliverables-checklist.md`
- `agent-prompt-template.md`

## Shared standards (all agents)

- API-first design with versioned contracts.
- Security by default (least privilege, encrypted transport/storage, secret management).
- Observability by default (logs, metrics, traces, alerts).
- Testability by default (unit + integration + e2e for critical paths).
- Documentation as a deliverable, not an afterthought.
- Every major decision recorded in ADR format.

## Required product outcomes

- Consumer app (search, map, listings, save/alerts, affordability).
- Agent/broker workflow (lead capture, listing management, scheduling).
- Admin console (moderation, data quality, support operations).
- Enterprise controls (SLOs, incident response, compliance-ready architecture).
