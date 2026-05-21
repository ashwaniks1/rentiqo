import test from "node:test";
import assert from "node:assert/strict";
import { scoreAndRankListings } from "../ranking/ranker.js";

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
