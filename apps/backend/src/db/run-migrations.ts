import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Pool } from "pg";

export async function runMigrations(pool: Pool): Promise<string[]> {
  const baseDir = path.dirname(fileURLToPath(import.meta.url));
  const migrationsDir = path.join(baseDir, "migrations");
  const files = (await readdir(migrationsDir)).filter((file) => file.endsWith(".sql")).sort();

  await pool.query(`
    create table if not exists schema_migrations (
      migration_id text primary key,
      applied_at timestamptz not null default now()
    );
  `);

  const applied: string[] = [];
  for (const file of files) {
    const alreadyApplied = await pool.query("select 1 from schema_migrations where migration_id = $1", [file]);
    if ((alreadyApplied.rowCount ?? 0) > 0) {
      continue;
    }
    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    await pool.query("begin");
    try {
      await pool.query(sql);
      await pool.query("insert into schema_migrations (migration_id) values ($1)", [file]);
      await pool.query("commit");
      applied.push(file);
    } catch (error) {
      await pool.query("rollback");
      throw error;
    }
  }
  return applied;
}
