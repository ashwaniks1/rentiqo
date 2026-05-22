# Rentiqo Agent Task Board

This board is the single source of truth for multi-agent execution status.

## Status keys

- `READY`: can be started now (no unmet dependencies)
- `IN_PROGRESS`: currently being executed by an agent
- `BLOCKED`: waiting on dependency or external decision
- `REVIEW`: implemented, waiting on validation/signoff
- `DONE`: accepted and merged

## Operating rules

1. Every agent must read this file before starting work.
2. Every agent must update task status and notes before finishing.
3. Every completed task must link a handoff file in `docs/program/handoffs/`.
4. If blocked, include blocker owner and mitigation plan.
5. No task moves to `DONE` without acceptance criteria evidence.

## Wave plan

### Wave A (parallel now)

| ID | Task | Owner agent | Status | Dependencies | Acceptance criteria | Artifacts |
| --- | --- | --- | --- | --- | --- | --- |
| A1 | Backend feature integration (auth, saves, leads, admin APIs) | Backend Integration Agent | READY | None | API endpoints implemented + contract tests pass | `apps/backend/**`, `docs/backend/api-implementation-status.md` |
| A2 | Search integration (real query/ranking/matching pipeline) | Search Integration Agent | READY | None | Search flow implemented + ranking/matcher tests pass | `services/search/**`, `docs/search/*` |
| A3 | DevSecOps staging/deploy hardening | DevSecOps/SRE Agent | READY | None | CI/CD + staging deploy + observability checks active | `.github/workflows/**`, `docs/devops/*` |

### Wave B (after Wave A core endpoints are available)

| ID | Task | Owner agent | Status | Dependencies | Acceptance criteria | Artifacts |
| --- | --- | --- | --- | --- | --- | --- |
| B1 | Mobile API integration and MVP flow completion | Mobile Integration Agent | BLOCKED | A1, A2 | Search/listing/save/contact flows integrated with backend | `apps/mobile/**`, `docs/mobile/*` |
| B2 | Staging integration and e2e automation | QA Automation Agent | BLOCKED | A1, A2, B1 | Critical path e2e suite passing in CI/staging | `docs/qa/*`, test runner configs |

### Wave C (parallel, low coupling)

| ID | Task | Owner agent | Status | Dependencies | Acceptance criteria | Artifacts |
| --- | --- | --- | --- | --- | --- | --- |
| C1 | Compliance operational evidence execution | Compliance/Legal Agent | READY | None | Evidence log + control tracker complete | `docs/compliance/operational-evidence-log.md`, `docs/compliance/control-remediation-tracker.md` |
| C2 | Growth instrumentation and launch experiment setup | Growth Agent | READY | None | KPI instrumentation map + experiment backlog finalized | `docs/growth/*`, analytics integration notes |

### Wave D (final gate)

| ID | Task | Owner agent | Status | Dependencies | Acceptance criteria | Artifacts |
| --- | --- | --- | --- | --- | --- | --- |
| D1 | Final release command and go/no-go decision package | Launch Commander Agent | BLOCKED | B2, C1 | `npm run release:verify` passes + go/no-go log updated | `docs/program/go-no-go-decision-log.md`, `docs/release/release-evidence-manifest.md` |

## Blocker register

| Blocker ID | Affected task(s) | Description | Owner | Mitigation | Status |
| --- | --- | --- | --- | --- | --- |
| BL-001 | B1, B2 | Backend/search integrations not completed yet | Backend/Search owners | Complete Wave A and publish staging endpoints | Open |
| BL-002 | B2, D1 | Staging e2e pipeline not yet implemented | QA + DevSecOps | Add staging e2e runner and CI gate | Open |
| BL-003 | D1 | Compliance evidence still policy-heavy, limited operational proof | Compliance owner | Build evidence log from actual control execution | Open |

## Update log

| Timestamp (UTC) | Updated by | Change summary |
| --- | --- | --- |
| 2026-05-22T00:05:00Z | Program Orchestrator | Initial automation task board created |
| 2026-05-22T00:08:00Z | Program Orchestrator | Added launch playbook and copy/paste agent prompt pack |
