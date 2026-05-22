import { getEnvConfig } from "./config/env.js";
import { createHttpServer, logServerStarted } from "./http/server.js";
import { getRepository } from "./repositories/app-repository.js";

const env = getEnvConfig();
await getRepository().initialize();
const server = createHttpServer();

server.listen(env.port, () => {
  logServerStarted(env.port);
});
