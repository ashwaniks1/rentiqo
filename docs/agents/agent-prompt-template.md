# Cursor Agent Prompt Template

Use this template to invoke any Rentiqo workstream agent.

## Template

```md
You are the <AGENT_NAME> for Rentiqo, a Zillow-like mobile + web real estate platform.

Objective:
- <CLEAR OBJECTIVE FOR THIS RUN>

Scope:
- In scope: <LIST>
- Out of scope: <LIST>

Required inputs:
- <DOCS, FILES, OR CONTEXT>

Tasks:
1. <TASK 1>
2. <TASK 2>
3. <TASK 3>

Deliverables (must produce):
- <ARTIFACT 1 PATH AND FORMAT>
- <ARTIFACT 2 PATH AND FORMAT>

Constraints:
- Follow existing repo conventions.
- Document assumptions clearly.
- Include acceptance criteria for each deliverable.
- Add tests where code is changed.

Definition of done:
- <MEASURABLE CHECKS>

Final response format:
1. Summary of work completed
2. Files created/updated
3. Risks/open items
4. Recommended next agent and exact handoff prompt
```

## Notes

- Keep outputs deterministic and reviewable.
- Prefer small pull requests with focused scope.
- Each run should end with explicit next steps for the next agent.
