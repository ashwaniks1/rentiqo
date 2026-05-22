import type { SearchRequest } from "./search.js";

export type SavedSearch = {
  savedSearchId: string;
  userId: string;
  queryFingerprint: string;
  query: SearchRequest;
  channels: Array<"email" | "push" | "sms">;
};

export type ListingChangeEvent = {
  listingId: string;
  changedFields: string[];
  changedAt: string;
  fingerprintSignals?: string[];
};

export type AlertMatch = {
  savedSearchId: string;
  listingId: string;
  shouldNotify: boolean;
  dedupeKey: string;
};
