# Rentiqo Feed Operations Runbook

## Purpose

Provide operational procedures for monitoring, triaging, and recovering data feed incidents.

## 1) Daily operations checklist

1. Review feed intake dashboard for lag and failure spikes.
2. Verify freshness SLA and duplicate rate by source.
3. Check parser and normalization error queues.
4. Confirm index propagation lag is within threshold.

## 2) Common incident scenarios

## Scenario A: Source feed delay
- Symptoms: expected feed file/events missing.
- Actions:
  1. Confirm source status page and ingestion logs.
  2. Notify source contact if SLA threshold breached.
  3. Mark affected market data freshness banner if user impact is significant.

## Scenario B: Parser schema mismatch
- Symptoms: parse errors spike after source schema change.
- Actions:
  1. Quarantine malformed payloads.
  2. Patch source adapter mapping.
  3. Replay impacted feed window after fix.

## Scenario C: Duplicate surge
- Symptoms: duplicate ratio alert triggered.
- Actions:
  1. Inspect entity resolution matching confidence.
  2. Validate address/geocode normalization behavior.
  3. Adjust dedupe thresholds and run controlled replay.

## Scenario D: Search index lag
- Symptoms: canonical data updates not reflected in discovery.
- Actions:
  1. Check event stream backlog and consumer health.
  2. Restart or scale index updater workers.
  3. Reconcile impacted listing IDs.

## 3) Incident escalation

- Sev-1: platform-wide stale or incorrect listing impact.
- Sev-2: source-specific significant quality degradation.
- Sev-3: non-critical feed processing anomalies.

Escalation path:
1. On-call data engineer
2. Platform/SRE on-call
3. Program Director + Product Owner (if launch-risking)

## 4) Recovery and validation checklist

- [ ] Incident root cause identified.
- [ ] Mitigation deployed and monitored.
- [ ] Backfill/replay completed where required.
- [ ] Quality SLA back within thresholds.
- [ ] Post-incident report added to knowledge base.

## 5) Postmortem requirements

- Timeline of events
- Customer impact assessment
- Root cause
- Corrective actions
- Preventive actions with owners
