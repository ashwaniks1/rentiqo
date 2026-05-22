# Agent Launch Playbook

## Purpose

Provide a repeatable launch sequence for implementation agents so code-first MVP work lands with verification evidence and handoff continuity.

## Launch sequence

1. Read required architecture/program docs and identify missing artifacts.
2. Create a feature branch using `cursor/<scope>-<suffix>`.
3. Implement production-path code before updating documentation.
4. Add or extend tests for all changed behavior.
5. Run validation gates:
   - `npm run typecheck`
   - `npm test`
   - `npm run release:verify`
6. Update status trackers (`task-board`, domain implementation docs).
7. Create handoff in `docs/program/handoffs/` using `docs/program/handoff-template.md`.
8. Commit, push, and update/create PR.

## Guardrails

- Keep API responses aligned to `docs/architecture/api-contracts.md`.
- Prefer deterministic behavior in ranking and matching logic.
- Include explicit command output summaries in handoff docs.
