# AGENTS.md

## Cursor Cloud specific instructions

### Architecture

Rentiqo is an npm-workspaces monorepo (Node.js 22+) with these packages:

| Package | Path | Description |
|---------|------|-------------|
| `@rentiqo/backend` | `apps/backend` | HTTP API server (raw `node:http`, port 8080) |
| `@rentiqo/mobile` | `apps/mobile` | Expo React Native mobile app |
| `@rentiqo/search-service` | `services/search` | Ranking, alert matching, relevance evaluation |
| `@rentiqo/contracts` | `packages/contracts` | Shared TypeScript type contracts |

### Running services

- **Backend dev server:** `npm run dev:backend` — starts on port 8080 with hot reload via `tsx watch`
- **Search service:** `npm run dev:search` — runs boot logic then watches for changes (not a long-running server)
- **Mobile (Expo):** `npm run dev:mobile` — requires Expo CLI + simulator (optional in cloud)

### Key commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Typecheck all | `npm run typecheck` |
| Run tests | `npm test` |
| Backend dev | `npm run dev:backend` |
| Search dev | `npm run dev:search` |

### Non-obvious notes

- The backend uses Node.js built-in `node:http` (no Express/Fastify). Route handling is in `apps/backend/src/http/routes/v1.ts`.
- Tests use the Node.js built-in test runner via `tsx --test` (no Jest/Vitest).
- No database or external services are required at the current scaffold stage — everything runs in-memory.
- The `@rentiqo/contracts` package is referenced via `file:` protocol in workspace dependencies; TypeScript path aliases in each package's `tsconfig.json` resolve the source directly for development.
- The search service's `dev` script (`tsx watch src/index.ts`) executes the boot function on each save but does not expose an HTTP port.
- CI (`.github/workflows/ci.yml`) runs: `npm install` → `npm run typecheck` → `npm test`.
