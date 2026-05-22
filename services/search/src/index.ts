import { evaluateAlertMatches, evaluateRelevance, queryListings } from "./service.js";

function boot() {
  const searchResults = queryListings({
    query: "Austin",
    filters: { maxPrice: 500000, minBeds: 3 }
  });
  const evalResult = evaluateRelevance({
    queryId: "startup-check",
    results: searchResults.items,
    clickedListingId: searchResults.items[0]?.listingId
  });
  const alertMatches = evaluateAlertMatches(
    [{ savedSearchId: "saved-1", userId: "user-1", queryFingerprint: "austin-3br" }],
    {
      listingId: searchResults.items[0]?.listingId ?? "unknown",
      changedFields: ["price"],
      changedAt: new Date().toISOString()
    }
  );

  process.stdout.write(
    `${JSON.stringify({
      service: "search-service",
      rankedCount: searchResults.items.length,
      rankingVersion: searchResults.rankingVersion,
      evalResult,
      alertMatches
    })}\n`
  );
}

boot();
