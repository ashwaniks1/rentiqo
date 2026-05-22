import { db, getListingSummaryById } from "../../data/store.js";
import { HttpError } from "../../http/errors.js";
import { requireAuth } from "../../http/authz.js";
import type { AuthContext } from "../../http/types.js";

export function saveHome(auth: AuthContext | null, body: unknown) {
  const context = requireAuth(auth);
  const payload = body as { listingId?: string };
  if (!payload?.listingId) {
    throw new HttpError(400, "INVALID_REQUEST", "listingId is required");
  }

  if (!db.listings.has(payload.listingId)) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }

  const savedHomes = db.savedHomesByUser.get(context.userId) ?? new Set<string>();
  savedHomes.add(payload.listingId);
  db.savedHomesByUser.set(context.userId, savedHomes);
  return {
    saved_home_id: `${context.userId}-${payload.listingId}`,
    listingId: payload.listingId
  };
}

export function removeSavedHome(auth: AuthContext | null, listingId: string) {
  const context = requireAuth(auth);
  const savedHomes = db.savedHomesByUser.get(context.userId);
  savedHomes?.delete(listingId);
  return {
    deleted: true,
    listingId
  };
}

export function listSavedHomes(auth: AuthContext | null) {
  const context = requireAuth(auth);
  const savedHomes = Array.from(db.savedHomesByUser.get(context.userId) ?? []);
  const items = savedHomes
    .map((listingId) => getListingSummaryById(listingId))
    .filter((listing): listing is NonNullable<typeof listing> => Boolean(listing));
  return { items, nextCursor: null };
}

export function createSavedSearch(auth: AuthContext | null, body: unknown) {
  const context = requireAuth(auth);
  const payload = body as {
    queryFingerprint?: string;
    channels?: { push?: boolean; email?: boolean };
    criteria?: Record<string, unknown>;
  };
  if (!payload?.queryFingerprint) {
    throw new HttpError(400, "INVALID_REQUEST", "queryFingerprint is required");
  }

  const savedSearches = db.savedSearchesByUser.get(context.userId) ?? [];
  const savedSearchId = `saved-search-${context.userId}-${savedSearches.length + 1}`;
  const savedSearch = {
    savedSearchId,
    userId: context.userId,
    queryFingerprint: payload.queryFingerprint,
    channels: {
      push: payload.channels?.push ?? true,
      email: payload.channels?.email ?? true
    },
    criteria: payload.criteria ?? {}
  };
  savedSearches.push(savedSearch);
  db.savedSearchesByUser.set(context.userId, savedSearches);
  return savedSearch;
}

export function updateSavedSearch(auth: AuthContext | null, savedSearchId: string, body: unknown) {
  const context = requireAuth(auth);
  const payload = body as {
    queryFingerprint?: string;
    channels?: { push?: boolean; email?: boolean };
    criteria?: Record<string, unknown>;
  };

  const savedSearches = db.savedSearchesByUser.get(context.userId) ?? [];
  const target = savedSearches.find((item) => item.savedSearchId === savedSearchId);
  if (!target) {
    throw new HttpError(404, "SAVED_SEARCH_NOT_FOUND", "Saved search not found");
  }

  if (payload.queryFingerprint) {
    target.queryFingerprint = payload.queryFingerprint;
  }
  if (payload.criteria) {
    target.criteria = { ...target.criteria, ...payload.criteria };
  }
  if (payload.channels) {
    target.channels = {
      push: payload.channels.push ?? target.channels.push,
      email: payload.channels.email ?? target.channels.email
    };
  }

  return target;
}

export function deleteSavedSearch(auth: AuthContext | null, savedSearchId: string) {
  const context = requireAuth(auth);
  const savedSearches = db.savedSearchesByUser.get(context.userId) ?? [];
  const filtered = savedSearches.filter((savedSearch) => savedSearch.savedSearchId !== savedSearchId);
  db.savedSearchesByUser.set(context.userId, filtered);
  return {
    deleted: true,
    savedSearchId
  };
}
