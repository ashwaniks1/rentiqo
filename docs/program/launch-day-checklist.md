# Launch Day Checklist

## A. Pre-launch (T-24h to T-1h)

- [ ] Release candidate approved and tagged.
- [ ] CI pipelines green for release commit.
- [ ] Critical defect queue reviewed and clear.
- [ ] Feature flags configured for controlled rollout.
- [ ] On-call roster active with backup coverage.
- [ ] Stakeholder communication channel opened.

## B. Launch window (T0)

- [ ] Run `scripts/release/verify-readiness.sh`.
- [ ] Start canary deployment for backend/search services.
- [ ] Confirm health checks and baseline SLO widgets stable.
- [ ] Promote mobile release according to store rollout plan.
- [ ] Execute production smoke tests (search, listing, save, contact/tour).

## C. Early monitoring (T+0 to T+4h)

- [ ] Track API p95 and error rate every 15 minutes.
- [ ] Track crash-free sessions and conversion flow events.
- [ ] Verify listing freshness and alert pipeline lag.
- [ ] Log and triage any anomalies by severity.

## D. Decision checkpoints

- [ ] T+1h continue/hold decision.
- [ ] T+4h continue/hold decision.
- [ ] T+24h stabilization review and handoff to normal operations.

## E. Rollback readiness

- [ ] Previous stable backend/search artifacts available.
- [ ] Feature-flag rollback path validated.
- [ ] Mobile release rollback communication plan prepared.
