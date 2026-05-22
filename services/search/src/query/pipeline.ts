import type { ListingSummary, SearchFilters, SearchRequest, SearchResponse } from "@rentiqo/contracts";
import { RANKING_VERSION, scoreAndRankListings, type RankedListing } from "../ranking/ranker.js";

type NormalizedFilters = {
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  propertyTypes: string[];
};

export type QueryPipelineResult = SearchResponse<RankedListing> & {
  meta: {
    rankingVersion: string;
    totalCandidates: number;
    filteredCount: number;
    appliedFilters: NormalizedFilters;
  };
};

function normalizeFilters(filters?: SearchFilters): NormalizedFilters {
  return {
    minPrice: filters?.minPrice ?? 0,
    maxPrice: filters?.maxPrice ?? Number.MAX_SAFE_INTEGER,
    minBeds: filters?.minBeds ?? 0,
    minBaths: filters?.minBaths ?? 0,
    propertyTypes: filters?.propertyTypes?.map((item) => item.toLowerCase()).sort() ?? []
  };
}

function applyHardFilters(listings: ListingSummary[], filters: NormalizedFilters): ListingSummary[] {
  return listings.filter((listing) => {
    const inPriceRange = listing.price >= filters.minPrice && listing.price <= filters.maxPrice;
    const hasRequiredBeds = listing.beds >= filters.minBeds;
    const hasRequiredBaths = listing.baths >= filters.minBaths;
    return inPriceRange && hasRequiredBeds && hasRequiredBaths;
  });
}

export function runSearchQueryPipeline(request: SearchRequest, listings: ListingSummary[]): QueryPipelineResult {
  const normalizedFilters = normalizeFilters(request.filters);
  const filteredListings = applyHardFilters(listings, normalizedFilters);
  const ranked = scoreAndRankListings(filteredListings, normalizedFilters);

  return {
    items: ranked,
    nextCursor: null,
    meta: {
      rankingVersion: RANKING_VERSION,
      totalCandidates: listings.length,
      filteredCount: filteredListings.length,
      appliedFilters: normalizedFilters
    }
  };
}
