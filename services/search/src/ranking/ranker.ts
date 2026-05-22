import type { ListingStatus, ListingSummary, SearchFilters } from "@rentiqo/contracts";

export const RANKING_VERSION = "v1-rule-based-20260522";

export type RankingBreakdown = {
  statusScore: number;
  priceScore: number;
  bedsScore: number;
  bathsScore: number;
};

export type RankedListing = ListingSummary & {
  score: number;
  rankingVersion: string;
  rankingBreakdown: RankingBreakdown;
};

const STATUS_WEIGHTS: Record<ListingStatus, number> = {
  active: 40,
  pending: 15,
  sold: -30,
  rented: -20,
  off_market: -35
};

function scorePriceFit(price: number, minPrice: number, maxPrice: number): number {
  if (price < minPrice) {
    const delta = minPrice - price;
    return -Math.min(30, Math.ceil(delta / 50_000) * 5);
  }

  if (price > maxPrice) {
    const delta = price - maxPrice;
    return -Math.min(30, Math.ceil(delta / 50_000) * 5);
  }

  return 20;
}

export function scoreAndRankListings(listings: ListingSummary[], filters?: SearchFilters): RankedListing[] {
  const minPrice = filters?.minPrice ?? 0;
  const maxPrice = filters?.maxPrice ?? Number.MAX_SAFE_INTEGER;
  const minBeds = filters?.minBeds ?? 0;
  const minBaths = filters?.minBaths ?? 0;

  return listings
    .map((listing) => {
      const rankingBreakdown: RankingBreakdown = {
        statusScore: STATUS_WEIGHTS[listing.status],
        priceScore: scorePriceFit(listing.price, minPrice, maxPrice),
        bedsScore: listing.beds >= minBeds ? 12 : -12,
        bathsScore: listing.baths >= minBaths ? 8 : -8
      };

      const score =
        rankingBreakdown.statusScore +
        rankingBreakdown.priceScore +
        rankingBreakdown.bedsScore +
        rankingBreakdown.bathsScore;

      return { ...listing, score, rankingVersion: RANKING_VERSION, rankingBreakdown };
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.price - b.price ||
        b.beds - a.beds ||
        b.baths - a.baths ||
        a.listingId.localeCompare(b.listingId)
    );
}
