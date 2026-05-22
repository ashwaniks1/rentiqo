import { getListingDataSource } from "./listing.data-source.js";

export function getListingDetail(listingId: string) {
  return getListingDataSource().getListingDetailById(listingId);
}

export function getListingHistory(listingId: string) {
  const listing = getListingDataSource().getListingDetailById(listingId);
  return listing?.priceHistory ?? null;
}
