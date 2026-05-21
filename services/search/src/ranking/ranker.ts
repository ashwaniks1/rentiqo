import type { ListingSummary, SearchFilters } from "@rentiqo/contracts";

type ScoredListing = ListingSummary & { score: number };

export function scoreAndRankListings(listings: ListingSummary[], filters?: SearchFilters): ScoredListing[] {
  const minBeds = filters?.minBeds ?? 0;
  const maxPrice = filters?.maxPrice ?? Number.MAX_SAFE_INTEGER;

  return listings
    .map((listing) => {
      let score = 0;
      score += listing.beds >= minBeds ? 2 : -1;
      score += listing.price <= maxPrice ? 2 : -2;
      score += listing.status === "active" ? 3 : -1;
      return { ...listing, score };
    })
    .sort((a, b) => b.score - a.score);
}
