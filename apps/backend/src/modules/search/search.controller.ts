import { createSeededListingDataset, executeListingSearch } from "@rentiqo/search-service";

const dataset = createSeededListingDataset();

export function searchListings(searchRequest: Record<string, unknown>) {
  return executeListingSearch(dataset, searchRequest);
}
