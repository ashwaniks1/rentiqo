import type { ListingDetail, ListingSummary, SearchRequest } from "@rentiqo/contracts";

export type SessionPayload = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string;
    role: "consumer" | "agent" | "admin";
  };
};

type ApiOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  token?: string;
  body?: unknown;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {})
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined
  });

  const payload = (await response.json()) as T & { message?: string };
  if (!response.ok) {
    throw new Error((payload as { message?: string }).message ?? "API request failed");
  }
  return payload as T;
}

export function login(email: string, password: string) {
  return request<SessionPayload>("/v1/auth/login", {
    method: "POST",
    body: { email, password }
  });
}

export function searchListings(token: string, searchRequest: SearchRequest) {
  return request<{ items: ListingSummary[]; nextCursor: string | null; rankingVersion: string }>("/v1/search/listings", {
    method: "POST",
    token,
    body: searchRequest
  });
}

export function getListingDetail(token: string, listingId: string) {
  return request<ListingDetail>(`/v1/listings/${listingId}`, {
    method: "GET",
    token
  });
}

export function saveHome(token: string, listingId: string) {
  return request<{ saved_home_id: string; listingId: string }>("/v1/saved-homes", {
    method: "POST",
    token,
    body: { listingId }
  });
}

export function removeSavedHome(token: string, listingId: string) {
  return request<{ deleted: boolean; listingId: string }>(`/v1/saved-homes/${listingId}`, {
    method: "DELETE",
    token
  });
}

export function listSavedHomes(token: string) {
  return request<{ items: ListingSummary[]; nextCursor: string | null }>("/v1/saved-homes", {
    method: "GET",
    token
  });
}

export function contactAgent(token: string, listingId: string, message: string) {
  return request<{ leadId: string; status: string }>(`/v1/listings/${listingId}/contact-agent`, {
    method: "POST",
    token,
    body: { message, contactPreference: "message" }
  });
}

export function requestTour(token: string, listingId: string, preferredWindows: string[]) {
  return request<{ tourRequestId: string; status: string }>(`/v1/listings/${listingId}/tour-requests`, {
    method: "POST",
    token,
    body: { preferredWindows }
  });
}

export function listInboxLeads(token: string) {
  return request<{ items: Array<{ leadId: string; leadType: string; status: string; listingId: string }> }>("/v1/me/leads", {
    method: "GET",
    token
  });
}
