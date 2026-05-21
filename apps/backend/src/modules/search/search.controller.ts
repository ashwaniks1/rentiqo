import type { IncomingMessage } from "node:http";

export function searchListings(_request: IncomingMessage) {
  return {
    items: [],
    nextCursor: null,
    message: "Search scaffolding active. Connect search-service to enable results."
  };
}
