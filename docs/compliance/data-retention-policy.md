# Data Retention Policy (MVP Baseline)

## 1) Policy principles

- Retain only as long as needed for product function, legal obligations, and security.
- Apply least-retention defaults where no legal requirement exists.
- Support deletion and anonymization workflows for eligible data.

## 2) Retention schedule

| Data type | Classification | Retention baseline | Deletion/anonymization rule |
| --- | --- | --- | --- |
| User account profile | Confidential | Active lifecycle + defined grace period | Delete or anonymize on approved account deletion request |
| Saved homes/searches | Confidential | Active lifecycle | Delete on user request or account deletion |
| Lead/tour request records | Confidential | Operational + legal review window | Anonymize requester data after retention period expires |
| Moderation/audit events | Internal/Confidential | Security/compliance retention window | Retain immutable audit trail per policy, limit PII fields |
| Raw feed ingestion payloads | Internal/Confidential | Provider contract-dependent | Purge per source license and data minimization rules |
| Metrics telemetry (non-PII) | Internal | Analytics window | Aggregate and purge raw granularity per policy |

## 3) Enforcement requirements

- Automated lifecycle jobs for expiration and purge.
- Retention exceptions documented with legal rationale.
- Deletion actions logged with actor and timestamp.

## 4) Compliance controls

- Align retention with applicable privacy laws and source agreements.
- Validate retention behavior during release audits.
