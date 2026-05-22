import { getEnvConfig } from "./config/env.js";
import { initializeStore } from "./data/store.js";
import { createHttpServer, logServerStarted } from "./http/server.js";

const env = getEnvConfig();
initializeStore();
const server = createHttpServer();

server.listen(env.port, () => {
  logServerStarted(env.port);
});
