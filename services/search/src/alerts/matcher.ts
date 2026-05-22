import type { AlertMatch, ListingChangeEvent, SavedSearch } from "@rentiqo/contracts";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function buildAlertDedupeKey(savedSearchId: string, listingEvent: ListingChangeEvent): string {
  const changedFields = [...listingEvent.changedFields].sort().join(",");
  const changedAtMinute = new Date(listingEvent.changedAt).toISOString().slice(0, 16);
  return `${savedSearchId}:${listingEvent.listingId}:${changedFields}:${changedAtMinute}`;
}

export function matchSavedSearches(
  savedSearches: SavedSearch[],
  listingEvent: ListingChangeEvent
): AlertMatch[] {
  const signals = (listingEvent.fingerprintSignals ?? []).map(normalize);
  return savedSearches.map((savedSearch) => {
    const fingerprint = normalize(savedSearch.queryFingerprint);
    const shouldNotify =
      signals.length === 0 ? true : signals.some((signal) => signal.includes(fingerprint) || fingerprint.includes(signal));

    return {
      savedSearchId: savedSearch.savedSearchId,
      listingId: listingEvent.listingId,
      shouldNotify,
      dedupeKey: buildAlertDedupeKey(savedSearch.savedSearchId, listingEvent)
    };
  });
}
