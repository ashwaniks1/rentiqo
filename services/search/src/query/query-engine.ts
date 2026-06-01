import type { ListingSummary, SearchFilters, SearchRequest } from "@rentiqo/contracts";
import { SEARCH_RANKING_VERSION, scoreAndRankListings } from "../ranking/ranker.js";
import { getListingIndex } from "../data/listing-index.js";

function applyFilters(listings: ListingSummary[], filters: SearchFilters | undefined): ListingSummary[] {
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
    if (filters?.propertyTypes && filters.propertyTypes.length > 0) {
      if (!listing.propertyType || !filters.propertyTypes.includes(listing.propertyType)) {
        return false;
      }
    }
    return true;
  });
}

function applyTextQuery(listings: ListingSummary[], query: string | undefined): ListingSummary[] {
  if (!query) {
    return listings;
  }
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return listings;
  }
  return listings.filter((listing) => `${listing.city} ${listing.state}`.toLowerCase().includes(normalized));
}

export function executeSearch(searchRequest: SearchRequest, listings: ListingSummary[] = getListingIndex()) {
  const filtered = applyFilters(listings, searchRequest.filters);
  const textMatched = applyTextQuery(filtered, searchRequest.query);
  const ranked = scoreAndRankListings(textMatched, searchRequest.filters);
  return {
    items: ranked.map(({ score, ...listing }) => listing),
    nextCursor: null,
    rankingVersion: SEARCH_RANKING_VERSION
  };
}
