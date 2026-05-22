import test from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { createHttpServer } from "../http/server.js";
import { getRepository } from "../repositories/app-repository.js";

async function jsonRequest<T>(baseUrl: string, path: string, options: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    },
    ...options
  });
  const payload = (await response.json()) as T;
  return { response, payload };
}

test("critical path: login -> search -> listing detail -> save -> contact", async () => {
  await getRepository().initialize();
  const server = createHttpServer();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as AddressInfo;
  const baseUrl = `http://127.0.0.1:${address.port}`;

  try {
    const login = await jsonRequest<{ accessToken: string }>(baseUrl, "/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: "buyer@rentiqo.dev",
        password: "password123"
      })
    });
    assert.equal(login.response.status, 200);
    const token = login.payload.accessToken;
    assert.equal(Boolean(token), true);

    const search = await jsonRequest<{ items: Array<{ listingId: string }> }>(baseUrl, "/v1/search/listings", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query: "Austin", filters: { minBeds: 2 } })
    });
    assert.equal(search.response.status, 200);
    assert.equal(search.payload.items.length > 0, true);

    const listingId = search.payload.items[0]?.listingId;
    assert.equal(Boolean(listingId), true);

    const detail = await jsonRequest<{ listingId: string }>(baseUrl, `/v1/listings/${listingId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(detail.response.status, 200);
    assert.equal(detail.payload.listingId, listingId);

    const save = await jsonRequest<{ listingId: string }>(baseUrl, "/v1/saved-homes", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ listingId })
    });
    assert.equal(save.response.status, 201);
    assert.equal(save.payload.listingId, listingId);

    const contact = await jsonRequest<{ leadId: string }>(baseUrl, `/v1/listings/${listingId}/contact-agent`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message: "Interested in this listing." })
    });
    assert.equal(contact.response.status, 201);
    assert.equal(Boolean(contact.payload.leadId), true);
  } finally {
    server.close();
  }
});
