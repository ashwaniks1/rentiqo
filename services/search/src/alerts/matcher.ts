import type { AlertMatch, ListingChangeEvent, SavedSearch } from "@rentiqo/contracts";

function createDedupeKey(savedSearchId: string, listingId: string, changedFields: string[]): string {
  return `${savedSearchId}:${listingId}:${changedFields.sort().join(",")}`;
}

export function matchSavedSearches(
  savedSearches: SavedSearch[],
  listingEvent: ListingChangeEvent
): AlertMatch[] {
  const notifyFieldSet = new Set(["price", "status", "listed_at"]);
  const shouldNotify = listingEvent.changedFields.some((field) => notifyFieldSet.has(field));
  return savedSearches.map((savedSearch) => {
    const dedupeKey = createDedupeKey(savedSearch.savedSearchId, listingEvent.listingId, listingEvent.changedFields);
    return {
      savedSearchId: savedSearch.savedSearchId,
      listingId: listingEvent.listingId,
      shouldNotify,
      dedupeKey
    };
  });
}
