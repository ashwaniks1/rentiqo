import type { SearchRequest } from "@rentiqo/contracts";
import { HttpError } from "../../http/errors.js";
import type { RequestContext } from "../../http/types.js";
import { queryListings } from "../../../../../services/search/src/service.js";

export function searchListings(request: RequestContext) {
  const payload = (request.body ?? {}) as SearchRequest;
  if (payload.filters && typeof payload.filters !== "object") {
    throw new HttpError(400, "INVALID_REQUEST", "filters must be an object");
  }
  return queryListings(payload);
}
