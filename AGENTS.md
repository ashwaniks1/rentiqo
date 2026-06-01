# AGENTS.md

## Cursor Cloud specific instructions

### Architecture

Rentiqo is an npm-workspaces monorepo (Node.js 22+, npm 10+). All workspace packages are hoisted to a single root `node_modules/` with symlinks under `node_modules/@rentiqo/`.

| Package | Path | Role |
|---------|------|------|
| `@rentiqo/backend` | `apps/backend` | HTTP API (raw `node:http`, port 8080) |
| `@rentiqo/mobile` | `apps/mobile` | Expo React Native app (optional in cloud) |
| `@rentiqo/search-service` | `services/search` | Ranking, alert matching, relevance evaluation |
| `@rentiqo/contracts` | `packages/contracts` | Shared TypeScript type contracts |

### Startup behavior

After the update script (`npm install`) runs, the environment is immediately ready:
- All 638 packages installed and hoisted to root `node_modules/`
- Workspace symlinks created at `node_modules/@rentiqo/{backend,contracts,mobile,search-service}`
- `@rentiqo/contracts` linked into both `@rentiqo/backend` and `@rentiqo/search-service` via `file:` protocol
- No separate build step is needed — `tsx` and TypeScript path aliases resolve contracts source directly

When `node_modules/` already exists from a prior snapshot, `npm install` completes in ~1s (no-op validation). Cold installs take ~4s.

### Key commands

| Task | Command | Notes |
|------|---------|-------|
| Install deps + link workspaces | `npm install` | Idempotent; handles workspace symlinks |
| Typecheck all | `npm run typecheck` | Runs tsc --noEmit across all 4 workspaces |
| Run tests | `npm test` | backend (3 tests) + search-service (3 tests) via Node.js built-in test runner |
| Backend dev server | `npm run dev:backend` | Starts on port 8080, hot-reloads via `tsx watch` |
| Search service dev | `npm run dev:search` | Executes boot logic then watches for file changes |
| Release verification | `npm run release:verify` | Checks required docs exist, then runs typecheck + test |

### Non-obvious notes

- **No framework**: Backend uses `node:http` directly. Route handling is in `apps/backend/src/http/routes/v1.ts`.
- **No test framework**: Tests use Node.js built-in `node:test` via `tsx --test` (not Jest/Vitest).
- **No external services needed**: Everything is in-memory stubs at the current scaffold stage.
- **Contracts resolution**: TypeScript `paths` in each consumer's `tsconfig.json` map `@rentiqo/contracts` → `../../packages/contracts/src/index.ts` for dev. The `file:` dep in `package.json` handles runtime linking.
- **Search service is not a server**: `dev:search` runs the boot function once and enters watch mode — it does not listen on a port.
- **Release verify** (`scripts/release/verify-readiness.sh`): checks docs existence, then delegates to `npm run typecheck` and `npm test`. No additional setup beyond `npm install`.
- **CI parity**: `.github/workflows/ci.yml` runs `npm install` → `typecheck` → `test`, same as local dev. Node version sourced from `.nvmrc`.
