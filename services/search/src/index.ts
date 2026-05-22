import { pathToFileURL } from "node:url";
import { matchSavedSearches } from "./alerts/matcher.js";
import { createSeededListingDataset } from "./data/listing-dataset.js";
import { evaluateBaseline } from "./evaluation/baseline.js";
import { executeListingSearch } from "./query/listing-search.js";
import { RANKING_VERSION } from "./ranking/ranker.js";

function boot() {
  const dataset = createSeededListingDataset();
  const ranked = executeListingSearch(dataset, {
    query: "austin",
    filters: { maxPrice: 500000, minBeds: 3, statuses: ["active"] },
    limit: 2
  });
  const evalResult = evaluateBaseline({
    queryId: "startup-check",
    results: ranked.items,
    clickedListingId: ranked.items[0]?.listingId
  });
  const alertMatches = matchSavedSearches(
    [
      {
        savedSearchId: "saved-1",
        userId: "user-1",
        queryFingerprint: "austin",
        query: { filters: { minBeds: 3 } },
        channels: ["email"]
      }
    ],
    {
      listingId: ranked.items[0]?.listingId ?? "unknown",
      changedFields: ["price"],
      changedAt: new Date().toISOString(),
      fingerprintSignals: ["austin", "3br", "active"]
    }
  );

  process.stdout.write(
    `${JSON.stringify({
      service: "search-service",
      rankedCount: ranked.items.length,
      rankingVersion: RANKING_VERSION,
      evalResult,
      alertMatches
    })}\n`
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  boot();
}
