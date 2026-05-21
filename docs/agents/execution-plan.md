# Rentiqo Execution Plan (Agent Sequence)

This plan defines the order in which Cursor agents should run and what must be true before each handoff.

## Stage 0 - Program Setup

**Owner:** Program Director Agent  
**Doc:** `00-program-director-agent.md`

Exit criteria:
- Repository structure and branching conventions documented.
- Environment strategy (dev/stage/prod) defined.
- RACI and dependency map approved.

## Stage 1 - Product Definition

**Owner:** Product Manager Agent  
**Doc:** `01-product-manager-agent.md`

Dependencies:
- Stage 0 complete.

Exit criteria:
- PRD complete.
- MVP scope frozen.
- Epic/story backlog with acceptance criteria drafted.

## Stage 2 - Architecture and UX Foundation

**Owners:** Solution Architect + UX/UI Agents  
**Docs:** `02-solution-architect-agent.md`, `03-ux-ui-agent.md`

Dependencies:
- Stage 1 complete.

Exit criteria:
- System architecture + ADR set complete.
- API contracts and domain model baseline complete.
- UX flows and design system baseline complete.

## Stage 3 - Data + Platform Core

**Owners:** Data Ingestion + Backend Platform + DevSecOps/SRE Agents  
**Docs:** `04-data-partnerships-and-ingestion-agent.md`, `05-backend-platform-agent.md`, `09-devsecops-sre-agent.md`

Dependencies:
- Stage 2 complete.

Exit criteria:
- Listing ingestion pipeline operational in staging.
- Core backend services and auth operational.
- CI/CD + observability + security controls operational.

## Stage 4 - Product Experience Build

**Owners:** Mobile App + Search/Recommendation Agents  
**Docs:** `06-mobile-app-agent.md`, `07-search-recommendation-agent.md`

Dependencies:
- Stage 3 core services available in staging.

Exit criteria:
- Mobile MVP feature set complete.
- Search relevance and alerting baselines meet target KPIs.

## Stage 5 - Quality, Compliance, and Launch Readiness

**Owners:** QA Automation + Compliance/Legal + Growth/Monetization Agents  
**Docs:** `08-qa-test-automation-agent.md`, `10-compliance-legal-agent.md`, `11-growth-monetization-agent.md`

Dependencies:
- Stage 4 feature complete candidate.

Exit criteria:
- Test suite and release gates green.
- Compliance controls and policy docs prepared.
- Go-to-market package and monetization launch plan complete.

## Stage 6 - Production Cutover

**Owner:** Program Director Agent

Exit criteria:
- Final launch checklist signed.
- Incident runbooks and on-call in place.
- App store submissions approved.
- Post-launch KPI dashboard active.
