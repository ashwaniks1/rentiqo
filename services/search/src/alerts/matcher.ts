import type { AlertMatch, ListingChangeEvent, ListingSummary, SavedSearch } from "@rentiqo/contracts";

function createDedupeKey(savedSearchId: string, listingId: string, changedFields: string[]): string {
  return `${savedSearchId}:${listingId}:${changedFields.sort().join(",")}`;
}

const NOTIFY_FIELDS = new Set(["price", "status", "listed_at"]);

function listingMatchesCriteria(listing: ListingSummary, criteria: NonNullable<SavedSearch["criteria"]>): boolean {
  if (criteria.minPrice !== undefined && listing.price < criteria.minPrice) return false;
  if (criteria.maxPrice !== undefined && listing.price > criteria.maxPrice) return false;
  if (criteria.minBeds !== undefined && listing.beds < criteria.minBeds) return false;
  if (criteria.minBaths !== undefined && listing.baths < criteria.minBaths) return false;
  if (criteria.city && listing.city.toLowerCase() !== criteria.city.toLowerCase()) return false;
  if (criteria.state && listing.state.toLowerCase() !== criteria.state.toLowerCase()) return false;
  if (criteria.statuses && criteria.statuses.length > 0 && !criteria.statuses.includes(listing.status)) return false;
  if (criteria.propertyTypes && criteria.propertyTypes.length > 0) {
    // propertyTypes filtering requires listing metadata not on ListingSummary — skip if unavailable
  }
  return true;
}

export function matchSavedSearches(
  savedSearches: SavedSearch[],
  listingEvent: ListingChangeEvent
): AlertMatch[] {
  const isNotifiableChange = listingEvent.changedFields.some((field) => NOTIFY_FIELDS.has(field));

  return savedSearches.map((savedSearch) => {
    const dedupeKey = createDedupeKey(savedSearch.savedSearchId, listingEvent.listingId, listingEvent.changedFields);

    let shouldNotify = isNotifiableChange;

    if (shouldNotify && savedSearch.criteria && listingEvent.listing) {
      shouldNotify = listingMatchesCriteria(listingEvent.listing, savedSearch.criteria);
    }

    return {
      savedSearchId: savedSearch.savedSearchId,
      listingId: listingEvent.listingId,
      shouldNotify,
      dedupeKey
    };
  });
}
