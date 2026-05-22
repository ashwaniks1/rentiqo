import test from "node:test";
import assert from "node:assert/strict";
import { routeV1 } from "../http/routes/v1.js";

type MockRequest = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: Record<string, unknown>;
};

type RouteResult = {
  statusCode: number;
  body: Record<string, any>;
};

function mockRequest(method: string, url: string, options?: Partial<Omit<MockRequest, "method" | "url">>): MockRequest {
  return {
    method,
    url,
    headers: options?.headers ?? {},
    body: options?.body
  };
}

async function callRoute(request: MockRequest): Promise<RouteResult> {
  return (await routeV1({ ...request, traceId: "test-trace" })) as RouteResult;
}

async function loginAsConsumer(): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await callRoute(
    mockRequest("POST", "/v1/auth/login", {
      body: {
        email: "consumer@rentiqo.dev",
        password: "pass-123"
      }
    })
  );

  assert.equal(response.statusCode, 200);
  return {
    accessToken: String(response.body.accessToken),
    refreshToken: String(response.body.refreshToken)
  };
}

function authHeader(token: string): Record<string, string> {
  return { authorization: `Bearer ${token}` };
}

test("GET /v1/health returns ok payload", async () => {
  const result = await callRoute(mockRequest("GET", "/v1/health"));
  assert.equal(result.statusCode, 200);
  const healthBody = result.body as { status?: string };
  assert.equal(healthBody.status, "ok");
});

test("auth endpoints provide register/login/refresh and me/preferences", async () => {
  const email = `new-user-${Date.now()}@rentiqo.dev`;
  const registerResult = await callRoute(
    mockRequest("POST", "/v1/auth/register", {
      body: {
        email,
        password: "pass-456"
      }
    })
  );
  assert.equal(registerResult.statusCode, 201);
  assert.equal(typeof registerResult.body.accessToken, "string");
  assert.equal(typeof registerResult.body.refreshToken, "string");

  const loginResult = await callRoute(
    mockRequest("POST", "/v1/auth/login", {
      body: {
        email,
        password: "pass-456"
      }
    })
  );
  assert.equal(loginResult.statusCode, 200);
  const accessToken = String(loginResult.body.accessToken);
  const refreshToken = String(loginResult.body.refreshToken);

  const meResult = await callRoute(
    mockRequest("GET", "/v1/me", {
      headers: authHeader(accessToken)
    })
  );
  assert.equal(meResult.statusCode, 200);
  assert.equal(typeof meResult.body.user.userId, "string");

  const preferencesResult = await callRoute(
    mockRequest("PATCH", "/v1/me/preferences", {
      headers: authHeader(accessToken),
      body: {
        emailNotifications: false,
        savedSearchDigest: "weekly"
      }
    })
  );
  assert.equal(preferencesResult.statusCode, 200);
  assert.equal(preferencesResult.body.preferences.emailNotifications, false);
  assert.equal(preferencesResult.body.preferences.savedSearchDigest, "weekly");

  const refreshResult = await callRoute(
    mockRequest("POST", "/v1/auth/refresh", {
      body: {
        refreshToken
      }
    })
  );
  assert.equal(refreshResult.statusCode, 200);
  assert.equal(typeof refreshResult.body.accessToken, "string");
});

test("POST /v1/search/listings returns ranked integrated results", async () => {
  const result = await callRoute(
    mockRequest("POST", "/v1/search/listings", {
      body: {
        query: "austin",
        filters: { statuses: ["active"], minBeds: 3 },
        limit: 2
      }
    })
  );
  assert.equal(result.statusCode, 200);
  assert.equal(Array.isArray(result.body.items), true);
  assert.equal(result.body.items.length > 0, true);
  assert.equal(typeof result.body.ranking.version, "string");
  assert.equal(Array.isArray(result.body.mapPoints), true);
});

test("GET /v1/listings/:id and /history return listing data", async () => {
  const result = await callRoute(mockRequest("GET", "/v1/listings/demo-listing-1001"));
  assert.equal(result.statusCode, 200);
  assert.equal(result.body.listingId, "demo-listing-1001");
  assert.equal(Array.isArray(result.body.mediaUrls), true);

  const history = await callRoute(mockRequest("GET", "/v1/listings/demo-listing-1001/history"));
  assert.equal(history.statusCode, 200);
  assert.equal(Array.isArray(history.body.events), true);
});

test("saved homes CRUD endpoints require auth and mutate state", async () => {
  const unauthorizedResult = await callRoute(mockRequest("GET", "/v1/saved-homes"));
  assert.equal(unauthorizedResult.statusCode, 401);

  const { accessToken } = await loginAsConsumer();
  const createResult = await callRoute(
    mockRequest("POST", "/v1/saved-homes", {
      headers: authHeader(accessToken),
      body: { listingId: "demo-listing-1001" }
    })
  );
  assert.equal(createResult.statusCode, 201);
  assert.equal(createResult.body.listingId, "demo-listing-1001");

  const listResult = await callRoute(
    mockRequest("GET", "/v1/saved-homes", {
      headers: authHeader(accessToken)
    })
  );
  assert.equal(listResult.statusCode, 200);
  assert.equal(Array.isArray(listResult.body.items), true);

  const deleteResult = await callRoute(
    mockRequest("DELETE", "/v1/saved-homes/demo-listing-1001", {
      headers: authHeader(accessToken)
    })
  );
  assert.equal(deleteResult.statusCode, 200);
  assert.equal(deleteResult.body.deleted, true);
});

test("saved searches CRUD endpoints mutate user saved searches", async () => {
  const { accessToken } = await loginAsConsumer();
  const createResult = await callRoute(
    mockRequest("POST", "/v1/saved-searches", {
      headers: authHeader(accessToken),
      body: {
        name: "Austin 3br",
        queryFingerprint: "austin-3br",
        query: {
          query: "austin",
          filters: { minBeds: 3 }
        },
        channels: ["email", "push"]
      }
    })
  );
  assert.equal(createResult.statusCode, 201);
  assert.equal(typeof createResult.body.savedSearchId, "string");

  const savedSearchId = String(createResult.body.savedSearchId);
  const patchResult = await callRoute(
    mockRequest("PATCH", `/v1/saved-searches/${savedSearchId}`, {
      headers: authHeader(accessToken),
      body: { queryFingerprint: "austin-updated" }
    })
  );
  assert.equal(patchResult.statusCode, 200);
  assert.equal(patchResult.body.queryFingerprint, "austin-updated");

  const listResult = await callRoute(
    mockRequest("GET", "/v1/saved-searches", {
      headers: authHeader(accessToken)
    })
  );
  assert.equal(listResult.statusCode, 200);
  assert.equal(listResult.body.items.length >= 1, true);

  const deleteResult = await callRoute(
    mockRequest("DELETE", `/v1/saved-searches/${savedSearchId}`, {
      headers: authHeader(accessToken)
    })
  );
  assert.equal(deleteResult.statusCode, 200);
  assert.equal(deleteResult.body.deleted, true);
});

test("contact-agent and tour-request endpoints enforce idempotency", async () => {
  const { accessToken } = await loginAsConsumer();
  const headers = {
    ...authHeader(accessToken),
    "idempotency-key": "idem-123"
  };
  const contactResult = await callRoute(
    mockRequest("POST", "/v1/listings/demo-listing-1001/contact-agent", {
      headers,
      body: {
        message: "Interested in this listing.",
        contactPreference: "email"
      }
    })
  );
  assert.equal(contactResult.statusCode, 201);
  assert.equal(typeof contactResult.body.leadId, "string");

  const repeatedContact = await callRoute(
    mockRequest("POST", "/v1/listings/demo-listing-1001/contact-agent", {
      headers,
      body: {
        message: "Interested in this listing.",
        contactPreference: "email"
      }
    })
  );
  assert.equal(repeatedContact.statusCode, 201);
  assert.equal(repeatedContact.body.leadId, contactResult.body.leadId);

  const tourResult = await callRoute(
    mockRequest("POST", "/v1/listings/demo-listing-1001/tour-requests", {
      headers,
      body: {
        preferredTimeWindows: ["2026-06-01T10:00:00.000Z/2026-06-01T12:00:00.000Z"],
        notes: "Weekend preferred"
      }
    })
  );
  assert.equal(tourResult.statusCode, 201);
  assert.equal(typeof tourResult.body.tourRequestId, "string");

  const missingIdempotency = await callRoute(
    mockRequest("POST", "/v1/listings/demo-listing-1001/tour-requests", {
      headers: authHeader(accessToken),
      body: {
        preferredTimeWindows: ["2026-06-01T10:00:00.000Z/2026-06-01T12:00:00.000Z"]
      }
    })
  );
  assert.equal(missingIdempotency.statusCode, 400);
});
