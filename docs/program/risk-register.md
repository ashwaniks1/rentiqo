# Rentiqo Risk Register

This register tracks delivery, operational, legal, and product risks for enterprise launch.

## Risk scale

- **Probability:** Low / Medium / High
- **Impact:** Low / Medium / High / Critical
- **Priority:** Determined by probability x impact

## Active risks

| ID | Risk | Probability | Impact | Priority | Owner | Mitigation | Fallback trigger |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R-001 | MLS/IDX licensing delays by launch region | Medium | Critical | High | Compliance + Data | Start with one launch market, use signed data contracts, track onboarding checklist weekly | If data contract not signed by Stage 3 exit, pivot to alternate region/provider |
| R-002 | Poor listing freshness or duplicate records | Medium | High | High | Data Ingestion | Canonical schema, dedupe rules, freshness alerts, replay pipeline | If freshness SLA breaches for 3 days, freeze paid acquisition in affected region |
| R-003 | Search relevance quality below user expectations | Medium | High | High | Search Agent | Offline relevance tests, click/save feedback loop, ranking configs | If search conversion KPI below threshold in beta, gate public launch |
| R-004 | API latency regressions under staging load | Medium | High | High | Backend + SRE | Load tests, caching strategy, p95 budgets by endpoint | If p95 exceeds budget for two runs, rollback to stable baseline release |
| R-005 | Mobile app crash rate above release threshold | Medium | High | High | Mobile Agent | Crash instrumentation, stability test suite, release candidate soak tests | If crash-free sessions below threshold, block app store submission |
| R-006 | Security misconfiguration (secrets, auth scope, RBAC) | Low | Critical | High | DevSecOps | Secret manager, policy checks in CI, least privilege reviews | Any critical finding blocks stage exit until remediated |
| R-007 | Compliance gaps in privacy rights workflow | Medium | High | High | Compliance Agent | Define delete/export/access flows early, legal review before Stage 5 exit | Unresolved legal gap blocks production cutover |
| R-008 | Over-scoping beyond MVP causing schedule drift | High | Medium | High | Program + Product | Scope freeze, explicit non-goals, change control process | Any non-MVP item requires documented tradeoff + approval |
| R-009 | Third-party cost growth (maps, notifications, search infra) | Medium | Medium | Medium | Program + DevOps | Cost observability dashboards and budgets by service | If monthly cost exceeds budget guardrail, optimize and throttle non-critical jobs |
| R-010 | Incomplete QA automation for critical journeys | Medium | High | High | QA Agent | Define test pyramid early, CI quality gates mandatory | Release blocked if critical e2e tests are missing or flaky |

## Risk review cadence

- Weekly review at stage level.
- Mandatory review before each release gate.
- New critical risks must be logged within the same execution cycle.

## Status values

- Open
- Mitigating
- Accepted
- Closed

Current status for all listed risks: **Open**.
