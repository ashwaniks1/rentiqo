import test from "node:test";
import assert from "node:assert/strict";
import { runSearchQueryPipeline } from "../query/pipeline.js";

test("query pipeline applies hard filters before ranking", () => {
  const result = runSearchQueryPipeline(
    {
      filters: {
        minPrice: 300000,
        maxPrice: 500000,
        minBeds: 3,
        minBaths: 2
      }
    },
    [
      {
        listingId: "within-range",
        price: 450000,
        beds: 3,
        baths: 2,
        city: "Austin",
        state: "TX",
        status: "active"
      },
      {
        listingId: "too-expensive",
        price: 650000,
        beds: 4,
        baths: 3,
        city: "Austin",
        state: "TX",
        status: "active"
      },
      {
        listingId: "too-few-beds",
        price: 400000,
        beds: 2,
        baths: 2,
        city: "Austin",
        state: "TX",
        status: "active"
      }
    ]
  );

  assert.equal(result.items.length, 1);
  assert.equal(result.items[0]?.listingId, "within-range");
  assert.equal(result.meta.totalCandidates, 3);
  assert.equal(result.meta.filteredCount, 1);
  assert.equal(result.meta.appliedFilters.minBaths, 2);
});
