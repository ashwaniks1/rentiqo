import type { SearchRequest } from "@rentiqo/contracts";
import { HttpError } from "../../http/errors.js";
import type { RequestContext } from "../../http/types.js";
import { queryListings } from "../../../../../services/search/src/service.js";
import { getRepository } from "../../repositories/app-repository.js";

export async function searchListings(request: RequestContext) {
  const repository = getRepository();
  const payload = (request.body ?? {}) as SearchRequest;
  if (payload.filters && typeof payload.filters !== "object") {
    throw new HttpError(400, "INVALID_REQUEST", "filters must be an object");
  }
  const listings = await repository.listListingSummaries();
  return queryListings(payload, listings);
}
