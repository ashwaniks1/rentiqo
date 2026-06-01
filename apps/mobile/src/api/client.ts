const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.message ?? `Request failed (${response.status})`);
  }
  return payload as T;
}

function authHeaders(token: string): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function loginUser(email: string, password: string) {
  return request("/v1/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function registerUser(email: string, password: string) {
  return request("/v1/auth/register", { method: "POST", body: JSON.stringify({ email, password }) });
}

export function searchListings(token: string, query: string, filters: Record<string, unknown> = {}) {
  return request("/v1/search/listings", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ query, filters }),
  });
}

export function getListingDetail(token: string, listingId: string) {
  return request(`/v1/listings/${listingId}`, { headers: authHeaders(token) });
}

export function listSavedHomes(token: string) {
  return request("/v1/saved-homes", { headers: authHeaders(token) });
}

export function saveHome(token: string, listingId: string) {
  return request("/v1/saved-homes", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ listingId }),
  });
}

export function removeSavedHome(token: string, listingId: string) {
  return request(`/v1/saved-homes/${listingId}`, { method: "DELETE", headers: authHeaders(token) });
}

export function contactAgent(token: string, listingId: string, message: string) {
  return request(`/v1/listings/${listingId}/contact-agent`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ message }),
  });
}

export function requestTour(token: string, listingId: string, preferredWindows: string[]) {
  return request(`/v1/listings/${listingId}/tour-requests`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ preferredWindows }),
  });
}

export function listInboxLeads(token: string) {
  return request("/v1/me/leads", { headers: authHeaders(token) });
}
