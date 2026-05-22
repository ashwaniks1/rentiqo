import test from "node:test";
import assert from "node:assert/strict";
import { buildAlertDedupeKey, deriveListingEventType, matchSavedSearches } from "../alerts/matcher.js";
import { evaluateBaseline, summarizeBaselineMetrics } from "../evaluation/baseline.js";

test("alert matcher applies fingerprint matching and dedupe key logic", () => {
  const dedupeCache = new Set<string>();
  const listingEvent = {
    listingId: "listing-1",
    changedFields: ["price", "fingerprint:austin-3br"],
    changedAt: new Date().toISOString()
  };
  const matches = matchSavedSearches(
    [
      { savedSearchId: "s1", userId: "u1", queryFingerprint: "austin-3br" },
      { savedSearchId: "s2", userId: "u2", queryFingerprint: "austin-2br" }
    ],
    listingEvent,
    { dedupeCache }
  );

  assert.equal(matches.length, 2);
  assert.equal(matches[0]?.shouldNotify, true);
  assert.equal(matches[1]?.shouldNotify, false);

  const dedupeKey = buildAlertDedupeKey(
    { savedSearchId: "s1", userId: "u1", queryFingerprint: "austin-3br" },
    listingEvent,
    "price_change"
  );
  assert.equal(dedupeCache.has(dedupeKey), true);

  const secondPass = matchSavedSearches(
    [{ savedSearchId: "s1", userId: "u1", queryFingerprint: "austin-3br" }],
    listingEvent,
    { dedupeCache }
  );
  assert.equal(secondPass[0]?.shouldNotify, false);
  assert.equal(deriveListingEventType(["status"]), "status_change");
});

test("baseline evaluator emits click/save metric signals", () => {
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
  assert.equal(result.clickSignal, 1);
  assert.equal(result.clickedRank, 1);
  assert.equal(result.saveOccurred, false);
  assert.equal(result.zeroResultQuery, false);
});

test("baseline summary reports measured metric rates", () => {
  const summary = summarizeBaselineMetrics([
    {
      queryId: "q1",
      clickAtTop3: true,
      saveOccurred: false,
      clickSignal: 1,
      saveSignal: 0,
      clickedRank: 1,
      resultCount: 2,
      zeroResultQuery: false
    },
    {
      queryId: "q2",
      clickAtTop3: false,
      saveOccurred: true,
      clickSignal: 0,
      saveSignal: 1,
      clickedRank: null,
      resultCount: 0,
      zeroResultQuery: true
    }
  ]);

  assert.equal(summary.sampleQueries, 2);
  assert.equal(summary.clickAtTop3Rate, 0.5);
  assert.equal(summary.saveRate, 0.5);
  assert.equal(summary.zeroResultRate, 0.5);
  assert.equal(summary.clickSignalCount, 1);
  assert.equal(summary.saveSignalCount, 1);
});
