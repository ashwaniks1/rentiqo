export type ListingStatus = "active" | "pending" | "sold" | "rented" | "off_market";

export type ListingSummary = {
  listingId: string;
  price: number;
  beds: number;
  baths: number;
  city: string;
  state: string;
  status: ListingStatus;
  propertyType?: string;
};

export type ListingDetail = ListingSummary & {
  description?: string;
  mediaUrls: string[];
  priceHistory: Array<{ timestamp: string; price: number }>;
};
