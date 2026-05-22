# Agent Launch Playbook (Immediate Execution)

Use this playbook to launch agents in the correct order with safe parallelism.

## 1) Before launching

1. Open `docs/program/task-board.md`.
2. Keep statuses as source of truth.
3. Launch agents with prompts from `docs/program/agent-prompts.md`.
4. Require each agent to write a handoff file using `docs/program/handoff-template.md`.

## 2) Launch order

## Wave A (launch all 3 in parallel now)

- A1 Backend Integration Agent
- A2 Search Integration Agent
- A3 DevSecOps/SRE Agent

After launch:
- Set A1/A2/A3 to `IN_PROGRESS` in `docs/program/task-board.md`.

After completion:
- Set completed tasks to `REVIEW` (then `DONE` once validated).
- Attach handoff links in task notes.

## Wave B (start when A1 and A2 are DONE)

- B1 Mobile Integration Agent
- B2 QA Automation Agent (can prep early, full run after B1)

## Wave C (can run in parallel with Wave B)

- C1 Compliance/Legal Agent
- C2 Growth Agent

## Wave D (final gate)

- D1 Launch Commander Agent

## 3) Mandatory gate checks

Before Wave D:
- `npm run typecheck` passes
- `npm test` passes
- staging critical flow evidence exists
- compliance evidence logs complete

Final gate:
- `npm run release:verify` must pass

## 4) Handoff discipline

Each agent must include:
- files changed
- tests/commands run
- blockers + mitigation
- exact next-agent prompt

No task can be marked `DONE` without this evidence.
