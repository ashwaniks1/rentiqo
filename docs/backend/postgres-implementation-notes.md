# Postgres Implementation Notes

## What is implemented

- Postgres client setup: `apps/backend/src/db/client.ts`
- Migration runner:
  - reusable runner: `apps/backend/src/db/run-migrations.ts`
  - CLI entrypoint: `apps/backend/src/db/migrate.ts`
  - initial schema migration: `apps/backend/src/db/migrations/0001_initial_schema.sql`
- Repository layer with dual mode (memory/postgres):
  - `apps/backend/src/repositories/app-repository.ts`
- Backend controllers now use repository methods (async), enabling postgres-backed runtime.

## Runtime modes

- `DATA_STORE_MODE=memory` -> existing in-memory store (default)
- `DATA_STORE_MODE=postgres` -> Postgres repository + migration initialization

## Commands

- Run migrations (postgres mode):
  - `npm run db:migrate -w @rentiqo/backend`
- Standard verification:
  - `npm run typecheck`
  - `npm test`
  - `npm run release:verify`

## Required environment variables

- `DATA_STORE_MODE`
- `DATABASE_URL`
- `DATABASE_SSL` (optional, `true` for SSL-enabled connections)

See `apps/backend/.env.example`.

## Supabase execution status (2026-05-22)

- Supabase MCP is now authenticated (`serverStatus: ready`).
- Connected project URL: `https://qijsrgweibzgbdpsfopk.supabase.co`
- Applied migration with MCP tool `apply_migration` using `rentiqo_initial_schema` query bundle.
- Verified tables and seed data using MCP:
  - `users`: 3 rows
  - `listings`: 2 rows
  - expected public tables are present (`users`, `listings`, `saved_homes`, `saved_searches`, `leads`, `moderation_cases`, `audit_events`, etc.).
- Verified backend runtime against session-pooler connection:
  - `npm run db:migrate -w @rentiqo/backend` (pass)
  - `npx tsx --test apps/backend/src/__tests__/critical-path.integration.test.ts` with `DATA_STORE_MODE=postgres` (pass)

## Current known gaps

- This MCP scope does not expose Supabase account-management tools (`create_project`, `list_projects`), so creating a brand-new Supabase project from this run is not possible.
- Supabase does not expose database passwords via MCP; `DATABASE_URL` must be assembled from Dashboard Connect values (project ref + DB password).
- Cloud runner networking is IPv4-only for this task, while direct DB host (`db.<project-ref>.supabase.co`) resolved to IPv6, so local `db:migrate` verification from this runner requires using the session pooler connection string from Dashboard.
