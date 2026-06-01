import type { ListingSummary, ListingStatus } from "./listing.js";
import type { SearchFilters } from "./search.js";

export type SavedSearch = {
  savedSearchId: string;
  userId: string;
  queryFingerprint: string;
  criteria?: SearchFilters & {
    city?: string;
    state?: string;
    statuses?: ListingStatus[];
  };
};

export type ListingChangeEvent = {
  listingId: string;
  changedFields: string[];
  changedAt: string;
  listing?: ListingSummary;
};

export type AlertMatch = {
  savedSearchId: string;
  listingId: string;
  shouldNotify: boolean;
  dedupeKey?: string;
};
