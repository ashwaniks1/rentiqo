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
  assert.equal(matches.every((item) => Boolean(item.dedupeKey)), true);
});

test("alert matcher suppresses notify on non-critical field changes", () => {
  const matches = matchSavedSearches(
    [{ savedSearchId: "s1", userId: "u1", queryFingerprint: "austin-3br" }],
    {
      listingId: "listing-1",
      changedFields: ["description"],
      changedAt: new Date().toISOString()
    }
  );
  assert.equal(matches[0]?.shouldNotify, false);
});

test("alert matcher filters by criteria when listing snapshot is provided", () => {
  const matches = matchSavedSearches(
    [
      {
        savedSearchId: "s-cheap",
        userId: "u1",
        queryFingerprint: "austin-cheap",
        criteria: { maxPrice: 400000, city: "Austin" }
      },
      {
        savedSearchId: "s-expensive",
        userId: "u2",
        queryFingerprint: "austin-luxury",
        criteria: { minPrice: 600000, city: "Austin" }
      }
    ],
    {
      listingId: "listing-1",
      changedFields: ["price"],
      changedAt: new Date().toISOString(),
      listing: {
        listingId: "listing-1",
        price: 350000,
        beds: 3,
        baths: 2,
        city: "Austin",
        state: "TX",
        status: "active"
      }
    }
  );

  assert.equal(matches.length, 2);
  assert.equal(matches[0]?.shouldNotify, true);
  assert.equal(matches[1]?.shouldNotify, false);
});

test("alert matcher notifies all saved searches when no listing snapshot", () => {
  const matches = matchSavedSearches(
    [
      {
        savedSearchId: "s1",
        userId: "u1",
        queryFingerprint: "austin-3br",
        criteria: { maxPrice: 100000 }
      }
    ],
    {
      listingId: "listing-1",
      changedFields: ["price"],
      changedAt: new Date().toISOString()
    }
  );

  assert.equal(matches[0]?.shouldNotify, true);
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
  assert.equal(result.conversionScore, 1);
});
