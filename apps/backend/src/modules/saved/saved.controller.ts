import { HttpError } from "../../http/errors.js";
import { requireAuth } from "../../http/authz.js";
import type { AuthContext } from "../../http/types.js";
import { getRepository } from "../../repositories/app-repository.js";

export async function saveHome(auth: AuthContext | null, body: unknown) {
  const repository = getRepository();
  const context = requireAuth(auth);
  const payload = body as { listingId?: string };
  if (!payload?.listingId) {
    throw new HttpError(400, "INVALID_REQUEST", "listingId is required");
  }

  const listing = await repository.getListingDetailById(payload.listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  return repository.saveHome(context.userId, payload.listingId);
}

export async function removeSavedHome(auth: AuthContext | null, listingId: string) {
  const repository = getRepository();
  const context = requireAuth(auth);
  await repository.removeSavedHome(context.userId, listingId);
  return {
    deleted: true,
    listingId
  };
}

export async function listSavedHomes(auth: AuthContext | null) {
  const repository = getRepository();
  const context = requireAuth(auth);
  const items = await repository.listSavedHomes(context.userId);
  return { items, nextCursor: null };
}

export async function createSavedSearch(auth: AuthContext | null, body: unknown) {
  const repository = getRepository();
  const context = requireAuth(auth);
  const payload = body as {
    queryFingerprint?: string;
    channels?: { push?: boolean; email?: boolean };
    criteria?: Record<string, unknown>;
  };
  if (!payload?.queryFingerprint) {
    throw new HttpError(400, "INVALID_REQUEST", "queryFingerprint is required");
  }

  return repository.createSavedSearch(context.userId, {
    queryFingerprint: payload.queryFingerprint,
    channels: {
      push: payload.channels?.push ?? true,
      email: payload.channels?.email ?? true
    },
    criteria: payload.criteria ?? {}
  });
}

export async function updateSavedSearch(auth: AuthContext | null, savedSearchId: string, body: unknown) {
  const repository = getRepository();
  const context = requireAuth(auth);
  const payload = body as {
    queryFingerprint?: string;
    channels?: { push?: boolean; email?: boolean };
    criteria?: Record<string, unknown>;
  };

  const target = await repository.updateSavedSearch(context.userId, savedSearchId, payload);
  if (!target) {
    throw new HttpError(404, "SAVED_SEARCH_NOT_FOUND", "Saved search not found");
  }

  return target;
}

export async function deleteSavedSearch(auth: AuthContext | null, savedSearchId: string) {
  const repository = getRepository();
  const context = requireAuth(auth);
  await repository.deleteSavedSearch(context.userId, savedSearchId);
  return {
    deleted: true,
    savedSearchId
  };
}
