import type { ListingSummary } from "@rentiqo/contracts";

const listingIndex: ListingSummary[] = [
  {
    listingId: "listing-1001",
    price: 475000,
    beds: 3,
    baths: 2,
    city: "Austin",
    state: "TX",
    status: "active",
    propertyType: "single_family"
  },
  {
    listingId: "listing-1002",
    price: 520000,
    beds: 4,
    baths: 3,
    city: "Austin",
    state: "TX",
    status: "active",
    propertyType: "single_family"
  },
  {
    listingId: "listing-1003",
    price: 399000,
    beds: 2,
    baths: 2,
    city: "Round Rock",
    state: "TX",
    status: "pending",
    propertyType: "condo"
  }
];

export function getListingIndex(): ListingSummary[] {
  return listingIndex;
}
