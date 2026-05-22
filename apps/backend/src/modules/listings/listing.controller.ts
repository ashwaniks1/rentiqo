import { HttpError } from "../../http/errors.js";
import { getRepository } from "../../repositories/app-repository.js";

export async function getListingDetail(listingId: string) {
  const repository = getRepository();
  const listing = await repository.getListingDetailById(listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  return listing;
}

export async function getListingHistory(listingId: string) {
  const repository = getRepository();
  const listing = await repository.getListingDetailById(listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  return {
    listingId,
    history: listing.history
  };
}
