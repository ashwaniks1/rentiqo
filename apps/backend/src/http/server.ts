import { createServer } from "node:http";
import { routeV1 } from "./routes/v1.js";
import { logError, logInfo } from "../lib/logger.js";

export function createHttpServer() {
  return createServer((request, response) => {
    try {
      const routed = routeV1(request);
      response.statusCode = routed.statusCode;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(routed.body));
    } catch (error) {
      logError("Unhandled request error", { error: String(error) });
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.end(
        JSON.stringify({
          code: "INTERNAL_ERROR",
          message: "Unexpected server error"
        })
      );
    }
  });
}

export function logServerStarted(port: number): void {
  logInfo("Backend API started", { port });
}
