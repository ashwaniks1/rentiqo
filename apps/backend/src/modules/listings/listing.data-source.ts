import { createSeededListingDataset, type ListingDataset } from "@rentiqo/search-service";

export type ListingDetail = {
  listingId: string;
  price: number;
  beds: number;
  baths: number;
  city: string;
  state: string;
  status: string;
  mediaUrls: string[];
  priceHistory: Array<{ timestamp: string; price: number }>;
  [key: string]: unknown;
};

export interface ListingDataSource {
  getListingDetailById(listingId: string): ListingDetail | null;
}

class SeededListingDataSource implements ListingDataSource {
  public constructor(private readonly dataset: ListingDataset) {}

  public getListingDetailById(listingId: string): ListingDetail | null {
    const listing = this.dataset.getListingById(listingId);
    if (!listing) {
      return null;
    }

    return listing as ListingDetail;
  }
}

let listingDataSource: ListingDataSource | null = null;

export function getListingDataSource(): ListingDataSource {
  if (!listingDataSource) {
    listingDataSource = new SeededListingDataSource(createSeededListingDataset());
  }
  return listingDataSource;
}
