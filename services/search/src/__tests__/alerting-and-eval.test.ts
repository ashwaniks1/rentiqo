import test from "node:test";
import assert from "node:assert/strict";
import { buildAlertDedupeKey, matchSavedSearches } from "../alerts/matcher.js";
import { evaluateBaseline } from "../evaluation/baseline.js";

test("alert matcher emits deterministic dedupe keys and filters by fingerprint", () => {
  const matches = matchSavedSearches(
    [
      {
        savedSearchId: "s1",
        userId: "u1",
        queryFingerprint: "austin",
        query: { filters: { minBeds: 3 } },
        channels: ["email"]
      },
      {
        savedSearchId: "s2",
        userId: "u2",
        queryFingerprint: "dallas",
        query: { filters: { minBeds: 2 } },
        channels: ["push"]
      }
    ],
    {
      listingId: "listing-1",
      changedFields: ["price"],
      changedAt: "2026-05-22T00:00:00.000Z",
      fingerprintSignals: ["austin", "active"]
    }
  );

  assert.equal(matches.length, 2);
  assert.equal(matches.find((item) => item.savedSearchId === "s1")?.shouldNotify, true);
  assert.equal(matches.find((item) => item.savedSearchId === "s2")?.shouldNotify, false);
  assert.equal(
    matches[0]?.dedupeKey,
    buildAlertDedupeKey("s1", {
      listingId: "listing-1",
      changedFields: ["price"],
      changedAt: "2026-05-22T00:00:00.000Z"
    })
  );
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
