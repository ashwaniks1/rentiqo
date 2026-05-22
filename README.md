# rentiqo

Agent delivery documentation for building Rentiqo as an enterprise-grade Zillow-like platform is available in:

- `docs/agents/README.md`

Stage 4 implementation scaffolding now exists for:

- `apps/backend` (Node.js TypeScript API baseline)
- `apps/mobile` (Expo React Native mobile baseline)
- `services/search` (ranking/alert/relevance baseline)
- `packages/contracts` (shared TypeScript contracts)

Release-readiness verification command:

- `npm run release:verify`

Agent orchestration entrypoints:

- `docs/program/task-board.md`
- `docs/program/handoff-template.md`
