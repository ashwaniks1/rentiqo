import type { SearchFilters, SearchRequest, SearchResponse } from "@rentiqo/contracts";
import type { SearchListingDocument, ListingDataset } from "../data/listing-dataset.js";
import { RANKING_VERSION, scoreAndRankListings } from "../ranking/ranker.js";

const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 50;

export type ListingSearchResult = SearchResponse<SearchListingDocument>;

function decodeCursor(cursor: string | null | undefined): number {
  if (!cursor) {
    return 0;
  }

  try {
    const decoded = Buffer.from(cursor, "base64url").toString("utf8");
    const parsed = Number(decoded);
    return Number.isInteger(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function encodeCursor(offset: number): string {
  return Buffer.from(String(offset), "utf8").toString("base64url");
}

function applyFilters(listings: SearchListingDocument[], filters?: SearchFilters): SearchListingDocument[] {
  return listings.filter((listing) => {
    if (filters?.minPrice !== undefined && listing.price < filters.minPrice) {
      return false;
    }
    if (filters?.maxPrice !== undefined && listing.price > filters.maxPrice) {
      return false;
    }
    if (filters?.minBeds !== undefined && listing.beds < filters.minBeds) {
      return false;
    }
    if (filters?.minBaths !== undefined && listing.baths < filters.minBaths) {
      return false;
    }
    if (filters?.propertyTypes?.length && (!listing.propertyType || !filters.propertyTypes.includes(listing.propertyType))) {
      return false;
    }
    if (filters?.statuses?.length && !filters.statuses.includes(listing.status)) {
      return false;
    }
    return true;
  });
}

function applyLocationAndQuery(listings: SearchListingDocument[], request: SearchRequest): SearchListingDocument[] {
  const normalizedQuery = request.query?.trim().toLowerCase();

  return listings.filter((listing) => {
    if (request.location?.city && listing.city.toLowerCase() !== request.location.city.toLowerCase()) {
      return false;
    }
    if (request.location?.state && listing.state.toLowerCase() !== request.location.state.toLowerCase()) {
      return false;
    }

    if (request.location?.bbox) {
      const { north, south, east, west } = request.location.bbox;
      const { latitude, longitude } = listing.location;
      if (latitude > north || latitude < south || longitude > east || longitude < west) {
        return false;
      }
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchText = [listing.city, listing.state, listing.postalCode, listing.description ?? ""].join(" ").toLowerCase();
    return searchText.includes(normalizedQuery);
  });
}

function sortRankedListings(
  listings: ReturnType<typeof scoreAndRankListings>,
  sort: SearchRequest["sort"] | undefined
): ReturnType<typeof scoreAndRankListings> {
  if (sort === "price_asc") {
    return [...listings].sort((a, b) => a.price - b.price || a.listingId.localeCompare(b.listingId));
  }
  if (sort === "price_desc") {
    return [...listings].sort((a, b) => b.price - a.price || a.listingId.localeCompare(b.listingId));
  }
  if (sort === "newest") {
    return [...listings].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt) || a.listingId.localeCompare(b.listingId));
  }
  return listings;
}

export function executeListingSearch(dataset: ListingDataset, request: SearchRequest): ListingSearchResult {
  const offset = decodeCursor(request.cursor);
  const limit = Math.min(Math.max(request.limit ?? DEFAULT_LIMIT, 1), MAX_LIMIT);
  const normalizedFilters = request.filters ?? {};
  const filteredByContext = applyLocationAndQuery(dataset.getListings(), request);
  const filteredListings = applyFilters(filteredByContext, normalizedFilters);
  const ranked = sortRankedListings(scoreAndRankListings(filteredListings, normalizedFilters), request.sort);
  const pageItems = ranked.slice(offset, offset + limit);
  const nextCursor = offset + limit < ranked.length ? encodeCursor(offset + limit) : null;

  return {
    items: pageItems,
    mapPoints: pageItems.map((item) => ({
      listingId: item.listingId,
      latitude: item.location.latitude,
      longitude: item.location.longitude
    })),
    nextCursor,
    appliedFilters: normalizedFilters,
    ranking: {
      version: RANKING_VERSION
    }
  };
}
