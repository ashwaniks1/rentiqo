export type DataStoreMode = "memory" | "postgres";

export type DatabaseConfig = {
  mode: DataStoreMode;
  databaseUrl: string | null;
  ssl: boolean;
};

export function getDatabaseConfig(): DatabaseConfig {
  const rawMode = process.env.DATA_STORE_MODE?.toLowerCase();
  const mode: DataStoreMode = rawMode === "postgres" ? "postgres" : "memory";
  const databaseUrl = process.env.DATABASE_URL ?? null;
  const ssl = process.env.DATABASE_SSL === "true";
  return {
    mode,
    databaseUrl,
    ssl
  };
}
