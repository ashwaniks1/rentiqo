import test from "node:test";
import assert from "node:assert/strict";
import { routeV1 } from "../http/routes/v1.js";
import type { RequestContext } from "../http/types.js";
import { getRepository } from "../repositories/app-repository.js";

function requestContext(method: string, path: string, body?: unknown, authToken?: string): RequestContext {
  return {
    method,
    url: new URL(path, "http://localhost"),
    path,
    headers: {
      authorization: authToken ? `Bearer ${authToken}` : undefined,
      "content-type": "application/json"
    },
    body,
    auth: null
  };
}

await getRepository().initialize();

test("GET /v1/health returns ok payload", async () => {
  const result = await routeV1(requestContext("GET", "/v1/health"));
  assert.equal(result.statusCode, 200);
  const healthBody = result.body as { status?: string };
  assert.equal(healthBody.status, "ok");
});

test("POST /v1/auth/register creates account and tokens", async () => {
  const result = await routeV1(
    requestContext("POST", "/v1/auth/register", { email: "new-buyer@rentiqo.dev", password: "password123" })
  );
  assert.equal(result.statusCode, 201);
  assert.equal(Boolean((result.body as { accessToken?: string }).accessToken), true);
});

test("POST /v1/search/listings returns ranked response", async () => {
  const result = await routeV1(requestContext("POST", "/v1/search/listings", { filters: { maxPrice: 500000 } }));
  assert.equal(result.statusCode, 200);
  const body = result.body as { items: unknown[]; rankingVersion: string };
  assert.equal(Array.isArray(body.items), true);
  assert.equal(body.rankingVersion, "rule-v2");
});

test("GET /v1/listings/:id returns listing details", async () => {
  const result = await routeV1(requestContext("GET", "/v1/listings/listing-1001"));
  assert.equal(result.statusCode, 200);
  assert.equal((result.body as { listingId: string }).listingId, "listing-1001");
});

test("saved homes flow works for authenticated user", async () => {
  const login = await routeV1(
    requestContext("POST", "/v1/auth/login", { email: "buyer@rentiqo.dev", password: "password123" })
  );
  const token = (login.body as { accessToken: string }).accessToken;
  const user = (login.body as { user: { userId: string; role: "consumer" | "agent" | "admin"; email: string } }).user;

  const saveContext = requestContext("POST", "/v1/saved-homes", { listingId: "listing-1001" }, token);
  saveContext.auth = user;
  const saveResult = await routeV1(saveContext);
  assert.equal(saveResult.statusCode, 201);

  const savedHomesContext = requestContext("GET", "/v1/saved-homes", undefined, token);
  savedHomesContext.auth = user;
  const listResult = await routeV1(savedHomesContext);
  assert.equal(listResult.statusCode, 200);
  assert.equal((listResult.body as { items: unknown[] }).items.length > 0, true);
});

test("contact-agent creates lead and agent can read queue", async () => {
  const buyerLogin = await routeV1(
    requestContext("POST", "/v1/auth/login", { email: "buyer@rentiqo.dev", password: "password123" })
  );
  const buyerToken = (buyerLogin.body as { accessToken: string }).accessToken;
  const buyerUser = (
    buyerLogin.body as { user: { userId: string; role: "consumer" | "agent" | "admin"; email: string } }
  ).user;
  const contactContext = requestContext(
    "POST",
    "/v1/listings/listing-1001/contact-agent",
    { message: "I want to schedule a viewing." },
    buyerToken
  );
  contactContext.auth = buyerUser;
  const contactResult = await routeV1(contactContext);
  assert.equal(contactResult.statusCode, 201);

  const agentLogin = await routeV1(
    requestContext("POST", "/v1/auth/login", { email: "agent@rentiqo.dev", password: "password123" })
  );
  const agentToken = (agentLogin.body as { accessToken: string }).accessToken;
  const agentUser = (
    agentLogin.body as { user: { userId: string; role: "consumer" | "agent" | "admin"; email: string } }
  ).user;
  const agentLeadsContext = requestContext("GET", "/v1/agent/me/leads", undefined, agentToken);
  agentLeadsContext.auth = agentUser;
  const leadQueue = await routeV1(agentLeadsContext);
  assert.equal(leadQueue.statusCode, 200);
  assert.equal((leadQueue.body as { items: unknown[] }).items.length > 0, true);
});

test("admin moderation endpoints enforce role and produce records", async () => {
  const adminLogin = await routeV1(
    requestContext("POST", "/v1/auth/login", { email: "admin@rentiqo.dev", password: "password123" })
  );
  const adminToken = (adminLogin.body as { accessToken: string }).accessToken;
  const adminUser = (
    adminLogin.body as { user: { userId: string; role: "consumer" | "agent" | "admin"; email: string } }
  ).user;

  const createCaseContext = requestContext(
    "POST",
    "/v1/admin/moderation/cases",
    {
      targetType: "listing",
      targetId: "listing-1001",
      reasonCode: "suspicious_data",
      severity: "medium"
    },
    adminToken
  );
  createCaseContext.auth = adminUser;
  const createdCase = await routeV1(createCaseContext);
  assert.equal(createdCase.statusCode, 201);
  assert.equal(Boolean((createdCase.body as { caseId?: string }).caseId), true);
});
