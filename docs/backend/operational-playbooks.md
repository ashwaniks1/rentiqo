# Rentiqo Backend Operational Playbooks

This document provides run procedures for common backend service operations and incidents.

## 1) Deployment playbook

1. Merge approved changes to release branch.
2. CI pipeline executes tests, security scans, and build steps.
3. Deploy to staging.
4. Run smoke tests for critical endpoints:
   - auth
   - search
   - listing detail
   - save/alert
   - contact/tour
5. Promote to production via canary release.
6. Monitor error rate, latency, and saturation before full rollout.

## 2) Rollback playbook

Trigger conditions:
- sustained elevated error rate
- severe latency regression
- critical functional regression

Steps:
1. Halt progressive rollout.
2. Route traffic to previous stable version.
3. Verify key endpoint health checks.
4. Document incident and root cause.

## 3) Service degradation triage

## Search latency spike
- Validate index health and cache hit rate.
- Check query volume anomalies and heavy filters.
- Scale search/query workers if saturation detected.

## Auth failure spike
- Check identity provider dependencies.
- Validate token signing/verification config.
- Confirm clock skew and key rotation integrity.

## Alert processing delay
- Inspect queue lag and worker health.
- Rebalance consumers and increase worker capacity.
- Reprocess delayed notifications once stabilized.

## 4) On-call escalation model

- Sev-1: page backend + SRE on-call immediately.
- Sev-2: page service owner and notify product/program owner.
- Sev-3: ticketed follow-up in next operations cycle.

## 5) Post-incident requirements

- Timeline and impact summary
- Root cause and detection gap
- Immediate mitigation actions
- Preventive tasks with ownership and due criteria
