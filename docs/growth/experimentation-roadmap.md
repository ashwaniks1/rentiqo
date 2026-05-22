# Experimentation Roadmap

## Experiment framework

Each experiment must include:
- Hypothesis
- Primary metric
- Guardrail metrics
- Sample/segment definition
- Clear rollout/rollback rule

## Phase 1 experiments (MVP growth)

1. Onboarding preference prompt variants
   - Goal: improve first-session search activation

2. Listing card CTA copy variants
   - Goal: improve listing-detail click-through

3. Save-search nudge timing
   - Goal: increase saved-search creation rate

4. Agent response SLA nudges
   - Goal: improve contact-to-response time

## Prioritized launch-safe backlog

| Priority | Experiment | Primary metric | Guardrail |
| --- | --- | --- | --- |
| P0 | Save-search nudge timing | Saved-search creation rate | Notification opt-out rate |
| P0 | Listing CTA copy variants | Listing-detail click-through | Bounce rate |
| P1 | Onboarding preference prompts | First-search activation | Session drop-off |
| P1 | Tour request CTA prominence | Tour submission rate | Contact flow error rate |

## Phase 2 experiments (post-MVP)

1. Personalized ranking signal weights
2. Notification cadence optimization
3. Monetization offer packaging tests

## Governance

- Product + Growth own prioritization.
- QA validates experiment integrity and event tracking.
- Compliance review required for experiments affecting consent/privacy.

## Event definitions required before experiment launch

- `experiment_exposure` (experiment_id, variant_id, user_id, timestamp)
- `experiment_conversion` (experiment_id, metric_name, value, timestamp)
- `experiment_guardrail_signal` (experiment_id, guardrail_name, value, timestamp)
