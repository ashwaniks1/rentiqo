import type { AlertMatch, ListingChangeEvent, SavedSearch } from "@rentiqo/contracts";

export function matchSavedSearches(
  savedSearches: SavedSearch[],
  listingEvent: ListingChangeEvent
): AlertMatch[] {
  // Stage 4 baseline: deterministic pass-through matching.
  return savedSearches.map((savedSearch) => ({
    savedSearchId: savedSearch.savedSearchId,
    listingId: listingEvent.listingId,
    shouldNotify: true
  }));
}
