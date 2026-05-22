import type { AlertMatch, ListingChangeEvent, SavedSearch } from "@rentiqo/contracts";

export type ListingEventType = "new_listing" | "price_change" | "status_change" | "listing_update";

export type MatchSavedSearchesOptions = {
  dedupeCache?: Set<string>;
};

const FINGERPRINT_PREFIX = "fingerprint:";

function normalizeFingerprint(fingerprint: string): string {
  return fingerprint.trim().toLowerCase();
}

function extractEventFingerprints(changedFields: string[]): Set<string> {
  const extracted = changedFields
    .filter((field) => field.startsWith(FINGERPRINT_PREFIX))
    .map((field) => normalizeFingerprint(field.slice(FINGERPRINT_PREFIX.length)));

  return new Set(extracted);
}

export function deriveListingEventType(changedFields: string[]): ListingEventType {
  if (changedFields.length === 0) {
    return "new_listing";
  }

  if (changedFields.some((field) => field === "price" || field === "price_change")) {
    return "price_change";
  }

  if (changedFields.some((field) => field === "status" || field === "status_change")) {
    return "status_change";
  }

  return "listing_update";
}

export function buildAlertDedupeKey(
  savedSearch: SavedSearch,
  listingEvent: ListingChangeEvent,
  eventType: ListingEventType
): string {
  return `${savedSearch.userId}:${savedSearch.savedSearchId}:${listingEvent.listingId}:${eventType}`;
}

function matchesSavedSearchFingerprint(savedSearch: SavedSearch, eventFingerprints: Set<string>): boolean {
  if (eventFingerprints.size === 0) {
    return true;
  }

  return eventFingerprints.has(normalizeFingerprint(savedSearch.queryFingerprint));
}

export function matchSavedSearches(
  savedSearches: SavedSearch[],
  listingEvent: ListingChangeEvent,
  options: MatchSavedSearchesOptions = {}
): AlertMatch[] {
  const dedupeCache = options.dedupeCache ?? new Set<string>();
  const eventType = deriveListingEventType(listingEvent.changedFields);
  const eventFingerprints = extractEventFingerprints(listingEvent.changedFields);

  return savedSearches.map((savedSearch) => ({
    savedSearchId: savedSearch.savedSearchId,
    listingId: listingEvent.listingId,
    shouldNotify: (() => {
      if (!matchesSavedSearchFingerprint(savedSearch, eventFingerprints)) {
        return false;
      }

      const dedupeKey = buildAlertDedupeKey(savedSearch, listingEvent, eventType);
      if (dedupeCache.has(dedupeKey)) {
        return false;
      }

      dedupeCache.add(dedupeKey);
      return true;
    })()
  }));
}
