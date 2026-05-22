declare module "@rentiqo/search-service" {
  export type ListingDataset = {
    getListings(): Array<Record<string, unknown>>;
    getListingById(listingId: string): Record<string, unknown> | null;
  };

  export function createSeededListingDataset(): ListingDataset;

  export function executeListingSearch(
    dataset: ListingDataset,
    request: Record<string, unknown>
  ): Record<string, unknown>;
}
