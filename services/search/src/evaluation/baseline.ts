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
};

export function evaluateBaseline(input: RelevanceEvalInput): RelevanceEvalOutput {
  const top3 = input.results.slice(0, 3).map((item) => item.listingId);
  return {
    queryId: input.queryId,
    clickAtTop3: input.clickedListingId ? top3.includes(input.clickedListingId) : false,
    saveOccurred: Boolean(input.savedListingId)
  };
}
