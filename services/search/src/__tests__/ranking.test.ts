import test from "node:test";
import assert from "node:assert/strict";
import type { ListingSummary } from "@rentiqo/contracts";
import { RANKING_VERSION, scoreAndRankListings } from "../ranking/ranker.js";

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
  assert.equal(ranked[0]?.rankingVersion, RANKING_VERSION);
});

test("ranking is deterministic with stable tie breakers", () => {
  const listings: ListingSummary[] = [
    {
      listingId: "tie-b",
      price: 500000,
      beds: 3,
      baths: 2,
      city: "Austin",
      state: "TX",
      status: "active"
    },
    {
      listingId: "tie-a",
      price: 500000,
      beds: 3,
      baths: 2,
      city: "Austin",
      state: "TX",
      status: "active"
    }
  ];

  const firstRun = scoreAndRankListings(listings, { minBeds: 3, minBaths: 2, maxPrice: 500000 });
  const secondRun = scoreAndRankListings(listings, { minBeds: 3, minBaths: 2, maxPrice: 500000 });

  assert.deepEqual(
    firstRun.map((item) => item.listingId),
    ["tie-a", "tie-b"]
  );
  assert.deepEqual(firstRun, secondRun);
});
