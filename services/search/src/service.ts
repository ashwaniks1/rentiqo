import type { ListingChangeEvent, ListingSummary, SavedSearch, SearchRequest } from "@rentiqo/contracts";
import { matchSavedSearches } from "./alerts/matcher.js";
import { evaluateBaseline, type RelevanceEvalInput } from "./evaluation/baseline.js";
import { executeSearch } from "./query/query-engine.js";

export function queryListings(searchRequest: SearchRequest, listings?: ListingSummary[]) {
  return executeSearch(searchRequest, listings);
}

export function evaluateAlertMatches(savedSearches: SavedSearch[], listingChangeEvent: ListingChangeEvent) {
  return matchSavedSearches(savedSearches, listingChangeEvent);
}

export function evaluateRelevance(input: RelevanceEvalInput) {
  return evaluateBaseline(input);
}
