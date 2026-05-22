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

## Current known gap

- Supabase project provisioning from this cloud run is blocked until Supabase MCP authentication is available in this environment (`serverStatus: needsAuth`).
