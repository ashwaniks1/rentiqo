import test from "node:test";
import assert from "node:assert/strict";
import { createSeededListingDataset } from "../data/listing-dataset.js";
import { executeListingSearch } from "../query/listing-search.js";
import { RANKING_VERSION, scoreAndRankListings } from "../ranking/ranker.js";

test("ranking prefers active listings in price range and exposes version", () => {
  const listings = createSeededListingDataset().getListings();
  const ranked = scoreAndRankListings(
    listings.filter((listing) => listing.listingId === "demo-listing-1001" || listing.listingId === "demo-listing-1003"),
    { maxPrice: 500000, minBeds: 3, statuses: ["active", "pending"] }
  );

  assert.equal(ranked[0]?.listingId, "demo-listing-1001");
  assert.equal(ranked[0]?.rankingVersion, RANKING_VERSION);
  assert.equal(ranked[0]?.rankingSignals.status > ranked[1]?.rankingSignals.status, true);
});

test("executeListingSearch returns deterministic order with pagination cursors", () => {
  const dataset = createSeededListingDataset();
  const firstPage = executeListingSearch(dataset, {
    query: "austin",
    filters: { statuses: ["active"] },
    limit: 2
  });

  assert.equal(firstPage.items.length, 2);
  assert.equal(firstPage.ranking.version, RANKING_VERSION);
  assert.equal(firstPage.nextCursor !== null, true);
  assert.equal(firstPage.items[0]?.listingId, "demo-listing-1004");

  const secondPage = executeListingSearch(dataset, {
    query: "austin",
    filters: { statuses: ["active"] },
    limit: 2,
    cursor: firstPage.nextCursor
  });

  assert.equal(secondPage.items.some((item) => item.listingId === firstPage.items[0]?.listingId), false);
  assert.equal(secondPage.mapPoints.every((point) => typeof point.latitude === "number"), true);
});
