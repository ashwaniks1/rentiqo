import type { ListingSummary, SearchFilters } from "@rentiqo/contracts";

export const SEARCH_RANKING_VERSION = "rule-v2";

export type ScoredListing = ListingSummary & { score: number };

export function scoreAndRankListings(listings: ListingSummary[], filters?: SearchFilters): ScoredListing[] {
  const minBeds = filters?.minBeds ?? 0;
  const minBaths = filters?.minBaths ?? 0;
  const minPrice = filters?.minPrice ?? 0;
  const maxPrice = filters?.maxPrice ?? Number.MAX_SAFE_INTEGER;

  return listings
    .map((listing) => {
      let score = 0;
      score += listing.status === "active" ? 5 : 1;
      score += listing.beds >= minBeds ? 2 : -1;
      score += listing.baths >= minBaths ? 2 : -1;
      score += listing.price >= minPrice && listing.price <= maxPrice ? 2 : -2;
      return { ...listing, score };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.listingId.localeCompare(right.listingId);
    });
}
