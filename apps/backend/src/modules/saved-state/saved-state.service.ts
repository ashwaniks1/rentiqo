import { randomUUID } from "node:crypto";

type SearchRequestPayload = Record<string, unknown>;

type SavedSearch = {
  savedSearchId: string;
  userId: string;
  queryFingerprint: string;
  query: SearchRequestPayload;
  channels: Array<"email" | "push" | "sms">;
};

export type SavedHomeRecord = {
  userId: string;
  listingId: string;
  savedAt: string;
};

export type SavedSearchRecord = SavedSearch & {
  name: string;
  createdAt: string;
  updatedAt: string;
};

class InMemorySavedStateService {
  private readonly savedHomesByUser = new Map<string, SavedHomeRecord[]>();
  private readonly savedSearchesByUser = new Map<string, SavedSearchRecord[]>();

  public createSavedHome(userId: string, listingId: string): SavedHomeRecord {
    const existing = this.savedHomesByUser.get(userId) ?? [];
    const found = existing.find((item) => item.listingId === listingId);
    if (found) {
      return found;
    }

    const record: SavedHomeRecord = {
      userId,
      listingId,
      savedAt: new Date().toISOString()
    };
    existing.push(record);
    this.savedHomesByUser.set(userId, existing);
    return record;
  }

  public listSavedHomes(userId: string): SavedHomeRecord[] {
    return [...(this.savedHomesByUser.get(userId) ?? [])];
  }

  public deleteSavedHome(userId: string, listingId: string): boolean {
    const existing = this.savedHomesByUser.get(userId) ?? [];
    const filtered = existing.filter((item) => item.listingId !== listingId);
    this.savedHomesByUser.set(userId, filtered);
    return filtered.length !== existing.length;
  }

  public createSavedSearch(params: {
    userId: string;
    name: string;
    queryFingerprint: string;
    query: SearchRequestPayload;
    channels: Array<"email" | "push" | "sms">;
  }): SavedSearchRecord {
    const existing = this.savedSearchesByUser.get(params.userId) ?? [];
    const now = new Date().toISOString();
    const record: SavedSearchRecord = {
      savedSearchId: `saved-search-${randomUUID()}`,
      userId: params.userId,
      name: params.name,
      queryFingerprint: params.queryFingerprint,
      query: params.query,
      channels: params.channels,
      createdAt: now,
      updatedAt: now
    };
    existing.push(record);
    this.savedSearchesByUser.set(params.userId, existing);
    return record;
  }

  public listSavedSearches(userId: string): SavedSearchRecord[] {
    return [...(this.savedSearchesByUser.get(userId) ?? [])];
  }

  public updateSavedSearch(
    userId: string,
    savedSearchId: string,
    patch: Partial<Pick<SavedSearchRecord, "query" | "queryFingerprint" | "channels" | "name">>
  ): SavedSearchRecord | null {
    const existing = this.savedSearchesByUser.get(userId) ?? [];
    const savedSearch = existing.find((item) => item.savedSearchId === savedSearchId);
    if (!savedSearch) {
      return null;
    }

    Object.assign(savedSearch, patch, { updatedAt: new Date().toISOString() });
    return savedSearch;
  }

  public deleteSavedSearch(userId: string, savedSearchId: string): boolean {
    const existing = this.savedSearchesByUser.get(userId) ?? [];
    const filtered = existing.filter((item) => item.savedSearchId !== savedSearchId);
    this.savedSearchesByUser.set(userId, filtered);
    return filtered.length !== existing.length;
  }
}

let savedStateService: InMemorySavedStateService | null = null;

export function getSavedStateService(): InMemorySavedStateService {
  if (!savedStateService) {
    savedStateService = new InMemorySavedStateService();
  }
  return savedStateService;
}
