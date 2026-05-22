import test from "node:test";
import assert from "node:assert/strict";
import { executeSearch } from "../query/query-engine.js";
import { SEARCH_RANKING_VERSION, scoreAndRankListings } from "../ranking/ranker.js";

test("ranking prefers active listings in price range", () => {
  const ranked = scoreAndRankListings(
    [
      {
        listingId: "a",
        price: 450000,
        beds: 3,
        baths: 2,
        city: "Austin",
        state: "TX",
        status: "active"
      },
      {
        listingId: "b",
        price: 700000,
        beds: 3,
        baths: 2,
        city: "Austin",
        state: "TX",
        status: "pending"
      }
    ],
    { maxPrice: 500000, minBeds: 3 }
  );

  assert.equal(ranked[0]?.listingId, "a");
});

test("query engine applies filters and exposes ranking version", () => {
  const result = executeSearch({
    query: "Austin",
    filters: { maxPrice: 500000, minBeds: 3 }
  });
  assert.equal(result.items.length > 0, true);
  assert.equal(result.items.every((item) => item.city === "Austin"), true);
  assert.equal(result.rankingVersion, SEARCH_RANKING_VERSION);
});
