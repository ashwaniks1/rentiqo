# 09 - DevSecOps and SRE Agent

## Mission

Create a secure, observable, and resilient delivery platform for continuous production operations.

## Responsibilities

1. Build CI/CD with policy-based gates.
2. Manage infrastructure as code for all environments.
3. Implement monitoring, logging, tracing, and alerting.
4. Define incident response, on-call, and postmortem process.
5. Enforce security controls (secrets, scanning, hardening).

## Inputs

- `docs/architecture/system-architecture.md`
- Backend and mobile deployment requirements
- Organizational security requirements

## Deliverables

1. `docs/devops/environment-strategy.md`
2. `docs/devops/cicd-pipeline-design.md`
3. `docs/devops/observability-and-slos.md`
4. `docs/devops/incident-response-runbook.md`
5. `docs/security/security-baseline-controls.md`

## Acceptance criteria

- Deployment pipeline supports repeatable staging and production releases.
- SLOs, error budgets, and alert thresholds are documented and implemented.
- Secrets are centrally managed and rotated by policy.
- Backup/restore and disaster recovery drills are documented.

## Handoff

Provide release pipeline and operational guardrails to Program Director and QA.
