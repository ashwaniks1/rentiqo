import { createServer } from "node:http";
import { routeV1 } from "./routes/v1.js";
import { logError, logInfo } from "../lib/logger.js";
import { createErrorEnvelope } from "./errors.js";
import { getUserByAccessToken } from "../data/store.js";
import { toAuthContext, type RequestContext } from "./types.js";

async function readJsonBody(requestBodyStream: AsyncIterable<Buffer | string>): Promise<unknown> {
  let body = "";
  for await (const chunk of requestBodyStream) {
    body += chunk.toString();
  }

  if (!body.trim()) {
    return undefined;
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("Invalid JSON body");
  }
}

function getAccessTokenFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null;
  }
  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
}

export function createHttpServer() {
  return createServer(async (request, response) => {
    try {
      const body = await readJsonBody(request);
      const url = new URL(request.url ?? "/", "http://localhost");
      const path = url.pathname;
      const headers = {
        authorization: request.headers.authorization,
        "content-type": request.headers["content-type"]
      };
      const token = getAccessTokenFromHeader(headers.authorization);
      const user = token ? getUserByAccessToken(token) : null;
      const requestContext: RequestContext = {
        method: request.method ?? "GET",
        url,
        path,
        headers,
        body,
        auth: user ? toAuthContext(user) : null
      };
      const routed = routeV1(requestContext);
      response.statusCode = routed.statusCode;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(routed.body));
    } catch (error) {
      logError("Unhandled request error", { error: String(error) });
      const envelope = createErrorEnvelope(error);
      response.statusCode = envelope.statusCode;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(envelope.body));
    }
  });
}

export function logServerStarted(port: number): void {
  logInfo("Backend API started", { port });
}
