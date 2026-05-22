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
  conversionScore: number;
};

export function evaluateBaseline(input: RelevanceEvalInput): RelevanceEvalOutput {
  const top3 = input.results.slice(0, 3).map((item) => item.listingId);
  const clickAtTop3 = input.clickedListingId ? top3.includes(input.clickedListingId) : false;
  const saveOccurred = Boolean(input.savedListingId);
  return {
    queryId: input.queryId,
    clickAtTop3,
    saveOccurred,
    conversionScore: (clickAtTop3 ? 1 : 0) + (saveOccurred ? 1 : 0)
  };
}
