# Rentiqo Security Baseline Controls

This baseline defines mandatory controls for Stage 3 and beyond.

## 1) Identity and access management

- Centralized identity provider integration.
- Least-privilege IAM roles for services and humans.
- MFA required for privileged internal access.
- Periodic access review for admin roles.

## 2) Application security

- Input validation and output encoding standards.
- Authentication and authorization checks on all protected APIs.
- Secure session and token handling with rotation and revocation support.
- Rate limiting and abuse protections at API edge.

## 3) Secrets and key management

- Secrets stored only in managed secret vault.
- No plaintext secrets in code, logs, or build artifacts.
- Key rotation policy and emergency revocation procedure documented.

## 4) Data protection

- Encryption in transit (TLS) and at rest.
- PII classification and handling guidelines.
- Data retention and deletion workflows aligned with compliance policy.
- Backup encryption and access controls.

## 5) SDLC security controls

- SAST and dependency scanning on every PR.
- Container and infrastructure vulnerability scans in CI.
- Critical vulnerability remediation required before release.
- Security review required for high-risk architecture changes.

### Implemented CI security gates (Task A3)

- `.github/workflows/ci.yml` enforces dependency review on pull requests via `actions/dependency-review-action`.
- `.github/workflows/ci.yml` enforces `npm audit --omit=dev --audit-level=high` for production dependency risk.
- `npm run release:verify` is required in CI and staging preflight.
- Staging deployment baseline requires observability and incident routing checks before environment promotion.

## 6) Monitoring and detection

- Security event logging and centralized aggregation.
- Alerting on suspicious auth patterns and privilege escalation attempts.
- Audit logs for admin and policy-sensitive actions.

## 7) Incident response for security events

- Security incidents follow formal severity process.
- Evidence preservation and timeline logging required.
- Post-incident review and control hardening mandatory.

## 8) Compliance readiness alignment

- Control mappings maintained for SOC2-readiness evidence collection.
- Policy docs versioned and review cadence defined.
