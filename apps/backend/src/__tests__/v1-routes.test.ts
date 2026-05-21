import test from "node:test";
import assert from "node:assert/strict";
import { routeV1 } from "../http/routes/v1.js";

type MockRequest = {
  method: string;
  url: string;
};

function mockRequest(method: string, url: string): MockRequest {
  return { method, url };
}

test("GET /v1/health returns ok payload", () => {
  const result = routeV1(mockRequest("GET", "/v1/health") as never);
  assert.equal(result.statusCode, 200);
  const healthBody = result.body as { status?: string };
  assert.equal(healthBody.status, "ok");
});

test("POST /v1/search/listings returns scaffold response", () => {
  const result = routeV1(mockRequest("POST", "/v1/search/listings") as never);
  assert.equal(result.statusCode, 200);
  assert.equal(Array.isArray((result.body as { items: unknown[] }).items), true);
});

test("GET /v1/listings/:id echoes listing id", () => {
  const result = routeV1(mockRequest("GET", "/v1/listings/demo-listing-1001") as never);
  assert.equal(result.statusCode, 200);
  assert.equal((result.body as { listingId: string }).listingId, "demo-listing-1001");
});
