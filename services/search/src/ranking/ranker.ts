import type { SearchFilters } from "@rentiqo/contracts";
import type { SearchListingDocument } from "../data/listing-dataset.js";

export const RANKING_VERSION = "v1-rule-based-mvp";

export type RankingSignals = {
  status: number;
  priceFit: number;
  bedsFit: number;
  bathsFit: number;
  freshness: number;
};

export type ScoredListing = SearchListingDocument & {
  score: number;
  rankingSignals: RankingSignals;
  rankingVersion: string;
};

export function scoreAndRankListings(
  listings: SearchListingDocument[],
  filters?: SearchFilters
): ScoredListing[] {
  const minBeds = filters?.minBeds ?? 0;
  const minBaths = filters?.minBaths ?? 0;
  const minPrice = filters?.minPrice ?? 0;
  const maxPrice = filters?.maxPrice ?? Number.MAX_SAFE_INTEGER;
  const mostRecentTimestamp = listings.reduce((latest, listing) => {
    const listingTs = Date.parse(listing.updatedAt);
    if (Number.isNaN(listingTs)) {
      return latest;
    }
    return Math.max(latest, listingTs);
  }, 0);

  return listings
    .map((listing) => {
      const statusScore = listing.status === "active" ? 5 : listing.status === "pending" ? 1 : -2;
      const priceFitScore = listing.price >= minPrice && listing.price <= maxPrice ? 4 : -3;
      const bedsFitScore = listing.beds >= minBeds ? 2 : -1;
      const bathsFitScore = listing.baths >= minBaths ? 1 : -1;
      const updatedAt = Date.parse(listing.updatedAt);
      const freshnessScore =
        Number.isNaN(updatedAt) || mostRecentTimestamp === 0
          ? 0
          : Math.max(0, 3 - Math.floor((mostRecentTimestamp - updatedAt) / 86400000));
      const rankingSignals: RankingSignals = {
        status: statusScore,
        priceFit: priceFitScore,
        bedsFit: bedsFitScore,
        bathsFit: bathsFitScore,
        freshness: freshnessScore
      };
      const score = Object.values(rankingSignals).reduce((acc, value) => acc + value, 0);
      return { ...listing, score, rankingSignals, rankingVersion: RANKING_VERSION };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      const updatedDiff = Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
      if (!Number.isNaN(updatedDiff) && updatedDiff !== 0) {
        return updatedDiff;
      }

      return a.listingId.localeCompare(b.listingId);
    });
}
