import { createServer, type IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";
import { routeV1 } from "./routes/v1.js";
import { logError, logInfo } from "../lib/logger.js";

async function readRequestBody(request: IncomingMessage): Promise<unknown> {
  if (request.method === "GET" || request.method === "HEAD") {
    return undefined;
  }

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    request.on("data", (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    request.on("end", () => resolve());
    request.on("error", reject);
  });

  if (chunks.length === 0) {
    return undefined;
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  if (!rawBody) {
    return undefined;
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    return undefined;
  }
}

export function createHttpServer() {
  return createServer(async (request, response) => {
    const traceId = randomUUID();
    try {
      const body = await readRequestBody(request);
      const routed = await routeV1({
        method: request.method,
        url: request.url,
        headers: request.headers,
        body,
        traceId
      });
      response.statusCode = routed.statusCode;
      response.setHeader("Content-Type", "application/json");
      response.setHeader("x-trace-id", traceId);
      response.end(JSON.stringify(routed.body));
    } catch (error) {
      logError("Unhandled request error", { error: String(error) });
      response.statusCode = 500;
      response.setHeader("Content-Type", "application/json");
      response.setHeader("x-trace-id", traceId);
      response.end(
        JSON.stringify({
          code: "INTERNAL_ERROR",
          message: "Unexpected server error",
          trace_id: traceId
        })
      );
    }
  });
}

export function logServerStarted(port: number): void {
  logInfo("Backend API started", { port });
}
