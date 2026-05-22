import { db } from "../../data/store.js";
import { HttpError } from "../../http/errors.js";

export function getListingDetail(listingId: string) {
  const listing = db.listings.get(listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  return listing;
}

export function getListingHistory(listingId: string) {
  const listing = db.listings.get(listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  return {
    listingId,
    history: listing.history
  };
}
