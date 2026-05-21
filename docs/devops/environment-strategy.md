# Rentiqo Environment Strategy

## 1) Environment topology

- **dev:** rapid iteration, lower-cost infrastructure, mock/sample data allowed
- **staging:** production-like deployment, integration and release candidate validation
- **prod:** customer-facing, high availability, strict change controls

## 2) Isolation and access

- Separate cloud projects/accounts per environment.
- Separate databases and object stores per environment.
- Access by least privilege with role-based environment permissions.
- No shared credentials across environments.

## 3) Configuration management

- Environment variables managed through centralized secret/config systems.
- Runtime config validated at startup with fail-fast behavior.
- Feature flags used for gradual rollout and safe toggles.

## 4) Data handling policy

- Development uses synthetic or anonymized datasets.
- Staging may use controlled subset data compliant with policy.
- Production data never copied to dev.
- Backup and retention configured per environment.

## 5) Promotion strategy

1. Build/test in CI.
2. Deploy candidate to staging.
3. Execute smoke + regression + security checks.
4. Promote approved artifact to production via canary.

## 6) Readiness requirements by environment

| Requirement | dev | staging | prod |
| --- | --- | --- | --- |
| Automated tests | Required | Required | Required |
| Security scans | Recommended | Required | Required |
| Observability baseline | Required | Required | Required |
| On-call alert routing | Optional | Required | Required |
| Change approval gate | Optional | Required | Required |
