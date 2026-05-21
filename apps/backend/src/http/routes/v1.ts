import type { IncomingMessage } from "node:http";
import { getHealthResponse } from "../../modules/health/health.controller.js";
import { getListingDetail } from "../../modules/listings/listing.controller.js";
import { searchListings } from "../../modules/search/search.controller.js";

export function routeV1(request: IncomingMessage) {
  const method = request.method ?? "GET";
  const requestUrl = new URL(request.url ?? "/", "http://localhost");
  const path = requestUrl.pathname;

  if (method === "GET" && path === "/v1/health") {
    return { statusCode: 200, body: getHealthResponse() };
  }

  if (method === "POST" && path === "/v1/search/listings") {
    return { statusCode: 200, body: searchListings(request) };
  }

  if (method === "GET" && path.startsWith("/v1/listings/")) {
    const listingId = path.replace("/v1/listings/", "");
    return { statusCode: 200, body: getListingDetail(listingId) };
  }

  return {
    statusCode: 404,
    body: {
      code: "NOT_FOUND",
      message: "Route not found"
    }
  };
}
