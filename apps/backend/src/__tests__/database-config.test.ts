import test from "node:test";
import assert from "node:assert/strict";
import { getDatabaseConfig } from "../config/database.js";

function restoreEnv(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }
  process.env[key] = value;
}

test("database config defaults to memory mode", () => {
  const previousMode = process.env.DATA_STORE_MODE;
  const previousUrl = process.env.DATABASE_URL;
  delete process.env.DATA_STORE_MODE;
  delete process.env.DATABASE_URL;
  const config = getDatabaseConfig();
  assert.equal(config.mode, "memory");
  assert.equal(config.databaseUrl, null);
  restoreEnv("DATA_STORE_MODE", previousMode);
  restoreEnv("DATABASE_URL", previousUrl);
});

test("database config resolves postgres mode with url", () => {
  const previousMode = process.env.DATA_STORE_MODE;
  const previousUrl = process.env.DATABASE_URL;
  process.env.DATA_STORE_MODE = "postgres";
  process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
  const config = getDatabaseConfig();
  assert.equal(config.mode, "postgres");
  assert.equal(Boolean(config.databaseUrl), true);
  restoreEnv("DATA_STORE_MODE", previousMode);
  restoreEnv("DATABASE_URL", previousUrl);
});
