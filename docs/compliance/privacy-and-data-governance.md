# Privacy and Data Governance Framework

## 1) Governance objectives

- Protect user privacy and sensitive real estate data.
- Ensure compliant collection, processing, sharing, and retention.
- Establish clear ownership and auditability for data policies.

## 2) Data classification model

### Class A - Restricted (highest)
- Authentication credentials and secrets
- Government ID/license metadata (if applicable)
- Sensitive internal security logs

### Class B - Confidential
- User profile PII (email, phone)
- Contact/tour request message payloads
- Agent verification metadata

### Class C - Internal
- Operational metrics and event telemetry (non-PII where possible)
- Moderation and support case metadata

### Class D - Public
- Public listing metadata allowed by source license terms

## 3) Data governance controls

- Data minimization: collect only what supports defined product purpose.
- Purpose limitation: prevent use beyond documented product/compliance needs.
- Access control: role-based access + least privilege.
- Encryption: in transit and at rest for confidential/restricted classes.
- Auditability: privileged data access logged and reviewable.

## 4) Data sharing policy

- External sharing must map to contract and user-consent boundaries.
- Third-party processors require security and privacy due diligence.
- Source-provider attribution and display obligations must be enforced.

## 5) Accountability and review cadence

- Policy owner: Compliance and Legal Agent (with Founder/Product Owner approval)
- Quarterly governance review
- Incident-triggered policy review for privacy/security events
