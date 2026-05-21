import test from "node:test";
import assert from "node:assert/strict";
import { matchSavedSearches } from "../alerts/matcher.js";
import { evaluateBaseline } from "../evaluation/baseline.js";

test("alert matcher emits one match per saved search", () => {
  const matches = matchSavedSearches(
    [
      { savedSearchId: "s1", userId: "u1", queryFingerprint: "austin-3br" },
      { savedSearchId: "s2", userId: "u2", queryFingerprint: "austin-2br" }
    ],
    {
      listingId: "listing-1",
      changedFields: ["price"],
      changedAt: new Date().toISOString()
    }
  );

  assert.equal(matches.length, 2);
  assert.equal(matches.every((item) => item.shouldNotify), true);
});

test("baseline evaluator marks click in top 3", () => {
  const result = evaluateBaseline({
    queryId: "q1",
    results: [
      {
        listingId: "listing-1",
        price: 300000,
        beds: 2,
        baths: 2,
        city: "Austin",
        state: "TX",
        status: "active"
      }
    ],
    clickedListingId: "listing-1"
  });

  assert.equal(result.clickAtTop3, true);
});
