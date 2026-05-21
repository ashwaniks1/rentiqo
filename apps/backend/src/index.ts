import { getEnvConfig } from "./config/env.js";
import { createHttpServer, logServerStarted } from "./http/server.js";

const env = getEnvConfig();
const server = createHttpServer();

server.listen(env.port, () => {
  logServerStarted(env.port);
});
