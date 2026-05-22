# Agent Handoff Template

Create one file per handoff in `docs/program/handoffs/` using this structure:

`docs/program/handoffs/<task-id>-<from-agent>-to-<to-agent>-<YYYYMMDDHHMM>.md`

---

## 1) Handoff metadata

- **Task ID:**  
- **From agent:**  
- **To agent:**  
- **Timestamp (UTC):**  
- **Related PR/commit SHA:**  

## 2) Completed scope

-  
-  

## 3) Files changed

- `path/to/file`
- `path/to/file`

## 4) Validation evidence

- Commands executed:
  - `npm run typecheck` -> pass/fail
  - `npm test` -> pass/fail
  - (additional task-specific checks)
- Notes:
  -  

## 5) Remaining work for next agent

1.  
2.  
3.  

## 6) Dependencies and blockers

- **Dependency status:** Ready / Blocked
- **Blocker details (if any):**
  - Blocker ID:
  - Owner:
  - Mitigation:

## 7) Acceptance criteria checklist

- [ ] Criterion 1 met
- [ ] Criterion 2 met
- [ ] Criterion 3 met

## 8) Exact next-agent prompt

```md
<paste the precise prompt the next agent should run>
```

## 9) Rollback/undo notes (if applicable)

-  

---

## Handoff quality rules

1. Do not mark a task `DONE` without validation evidence.
2. Always include exact next prompt text.
3. If blocked, update `docs/program/task-board.md` and blocker register.
4. Keep handoff factual and file-path specific.
