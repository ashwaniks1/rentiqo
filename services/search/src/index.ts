import type { ListingSummary } from "@rentiqo/contracts";
import { matchSavedSearches } from "./alerts/matcher.js";
import { evaluateBaseline } from "./evaluation/baseline.js";
import { scoreAndRankListings } from "./ranking/ranker.js";

const sampleListings: ListingSummary[] = [
  {
    listingId: "demo-listing-1001",
    price: 475000,
    beds: 3,
    baths: 2,
    city: "Austin",
    state: "TX",
    status: "active"
  },
  {
    listingId: "demo-listing-1002",
    price: 520000,
    beds: 4,
    baths: 3,
    city: "Austin",
    state: "TX",
    status: "active"
  }
];

function boot() {
  const ranked = scoreAndRankListings(sampleListings, { maxPrice: 500000, minBeds: 3 });
  const evalResult = evaluateBaseline({
    queryId: "startup-check",
    results: ranked,
    clickedListingId: ranked[0]?.listingId
  });
  const alertMatches = matchSavedSearches(
    [{ savedSearchId: "saved-1", userId: "user-1", queryFingerprint: "austin-3br" }],
    { listingId: ranked[0]?.listingId ?? "unknown", changedFields: ["price"], changedAt: new Date().toISOString() }
  );

  process.stdout.write(
    `${JSON.stringify({ service: "search-service", rankedCount: ranked.length, evalResult, alertMatches })}\n`
  );
}

boot();
