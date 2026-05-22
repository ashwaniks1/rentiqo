# Compliance Control Remediation Tracker

Use this tracker to close remaining compliance gaps with explicit ownership and target criteria.

| Control ID | Gap | Remediation action | Owner | Evidence required | Status |
| --- | --- | --- | --- | --- | --- |
| CR-001 | Retention policy enforcement is not automated | Implement purge/anonymization jobs and logs | Backend + Compliance | Job definitions + execution logs | Open |
| CR-002 | User-rights workflow lacks operational ticket evidence | Run dry-run requests for access/export/delete and retain proof | Compliance Ops | Completed request records | Open |
| CR-003 | MLS/IDX obligation mapping lacks contract attachments | Link signed obligations to technical controls by source | Compliance + Data | Clause mapping artifact | Open |
| CR-004 | SOC2 access review cadence lacks execution evidence | Establish monthly access review and sign-off records | DevSecOps + Compliance | Signed review log | Open |
| CR-005 | Security monitoring evidence lacks alert triage records | Capture real alert triage examples in operations log | DevSecOps | Alert + triage incident artifacts | In progress |
| CR-006 | DR exercise evidence not recorded | Execute DR simulation and publish outcomes | DevSecOps + Program | DR report with pass/fail | Open |

## Current priority order

1. CR-001
2. CR-002
3. CR-006
4. CR-003
5. CR-004
6. CR-005
