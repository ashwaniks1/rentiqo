export type SavedSearch = {
  savedSearchId: string;
  userId: string;
  queryFingerprint: string;
};

export type ListingChangeEvent = {
  listingId: string;
  changedFields: string[];
  changedAt: string;
};

export type AlertMatch = {
  savedSearchId: string;
  listingId: string;
  shouldNotify: boolean;
};
