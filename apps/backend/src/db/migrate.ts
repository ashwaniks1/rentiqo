import { getDatabaseConfig } from "../config/database.js";
import { getDbPool, closeDbPool } from "./client.js";
import { runMigrations } from "./run-migrations.js";

async function applyMigrations() {
  const config = getDatabaseConfig();
  if (config.mode !== "postgres") {
    process.stdout.write("Skipping migrations: DATA_STORE_MODE is not postgres.\n");
    return;
  }

  const pool = getDbPool();
  const applied = await runMigrations(pool);
  for (const migrationId of applied) {
    process.stdout.write(`Applied migration: ${migrationId}\n`);
  }

  process.stdout.write("Migration run complete.\n");
}

applyMigrations()
  .catch((error) => {
    process.stderr.write(`Migration failed: ${String(error)}\n`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDbPool();
  });
