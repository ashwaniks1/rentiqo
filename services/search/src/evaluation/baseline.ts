import type { ListingSummary } from "@rentiqo/contracts";

export type RelevanceEvalInput = {
  queryId: string;
  results: ListingSummary[];
  clickedListingId?: string;
  savedListingId?: string;
};

export type RelevanceEvalOutput = {
  queryId: string;
  clickAtTop3: boolean;
  saveOccurred: boolean;
  clickSignal: 0 | 1;
  saveSignal: 0 | 1;
  clickedRank: number | null;
  resultCount: number;
  zeroResultQuery: boolean;
};

export function evaluateBaseline(input: RelevanceEvalInput): RelevanceEvalOutput {
  const rankedListingIds = input.results.map((item) => item.listingId);
  const top3 = input.results.slice(0, 3).map((item) => item.listingId);
  const clickedRank = input.clickedListingId ? rankedListingIds.indexOf(input.clickedListingId) + 1 : 0;
  const saveOccurred = Boolean(input.savedListingId);

  return {
    queryId: input.queryId,
    clickAtTop3: input.clickedListingId ? top3.includes(input.clickedListingId) : false,
    saveOccurred,
    clickSignal: input.clickedListingId ? 1 : 0,
    saveSignal: saveOccurred ? 1 : 0,
    clickedRank: clickedRank > 0 ? clickedRank : null,
    resultCount: input.results.length,
    zeroResultQuery: input.results.length === 0
  };
}

export type RelevanceMetricSummary = {
  sampleQueries: number;
  clickAtTop3Rate: number;
  saveRate: number;
  zeroResultRate: number;
  clickSignalCount: number;
  saveSignalCount: number;
};

export function summarizeBaselineMetrics(results: RelevanceEvalOutput[]): RelevanceMetricSummary {
  if (results.length === 0) {
    return {
      sampleQueries: 0,
      clickAtTop3Rate: 0,
      saveRate: 0,
      zeroResultRate: 0,
      clickSignalCount: 0,
      saveSignalCount: 0
    };
  }

  const count = results.length;
  const clickAtTop3Count = results.filter((item) => item.clickAtTop3).length;
  const saveCount = results.filter((item) => item.saveOccurred).length;
  const zeroResultCount = results.filter((item) => item.zeroResultQuery).length;
  const clickSignalCount = results.reduce((sum, item) => sum + item.clickSignal, 0);
  const saveSignalCount = results.reduce((sum, item) => sum + item.saveSignal, 0);

  return {
    sampleQueries: count,
    clickAtTop3Rate: Number((clickAtTop3Count / count).toFixed(3)),
    saveRate: Number((saveCount / count).toFixed(3)),
    zeroResultRate: Number((zeroResultCount / count).toFixed(3)),
    clickSignalCount,
    saveSignalCount
  };
}
