import type { ListingSummary } from "@rentiqo/contracts";
import { matchSavedSearches } from "./alerts/matcher.js";
import { evaluateBaseline, summarizeBaselineMetrics } from "./evaluation/baseline.js";
import { runSearchQueryPipeline } from "./query/pipeline.js";

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
  const searchResult = runSearchQueryPipeline({ filters: { maxPrice: 500000, minBeds: 3 } }, sampleListings);
  const evalResult = evaluateBaseline({
    queryId: "startup-check",
    results: searchResult.items,
    clickedListingId: searchResult.items[0]?.listingId,
    savedListingId: searchResult.items[0]?.listingId
  });
  const evalSummary = summarizeBaselineMetrics([evalResult]);
  const alertMatches = matchSavedSearches(
    [{ savedSearchId: "saved-1", userId: "user-1", queryFingerprint: "austin-3br" }],
    {
      listingId: searchResult.items[0]?.listingId ?? "unknown",
      changedFields: ["price", "fingerprint:austin-3br"],
      changedAt: new Date().toISOString()
    }
  );

  process.stdout.write(
    `${JSON.stringify({
      service: "search-service",
      rankedCount: searchResult.items.length,
      rankingVersion: searchResult.meta.rankingVersion,
      evalResult,
      evalSummary,
      alertMatches
    })}\n`
  );
}

boot();
