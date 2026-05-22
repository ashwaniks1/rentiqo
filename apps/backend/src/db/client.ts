import { Pool } from "pg";
import { getDatabaseConfig } from "../config/database.js";

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (pool) {
    return pool;
  }

  const config = getDatabaseConfig();
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is required when DATA_STORE_MODE=postgres");
  }

  pool = new Pool({
    connectionString: config.databaseUrl,
    ssl: config.ssl ? { rejectUnauthorized: false } : undefined
  });
  return pool;
}

export async function closeDbPool() {
  if (!pool) {
    return;
  }
  await pool.end();
  pool = null;
}
