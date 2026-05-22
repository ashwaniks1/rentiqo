export type ListingStatus = "active" | "pending" | "sold" | "rented" | "off_market";

export type PropertyType =
  | "house"
  | "condo"
  | "townhome"
  | "multi_family"
  | "apartment"
  | "land";

export type ListingSummary = {
  listingId: string;
  sourceProvider?: string;
  price: number;
  beds: number;
  baths: number;
  propertyType?: PropertyType;
  city: string;
  state: string;
  postalCode?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: ListingStatus;
  hasPriceReduction?: boolean;
  daysOnMarket?: number;
  schoolScore?: number;
  updatedAt?: string;
};

export type ListingDetail = ListingSummary & {
  description?: string;
  mediaUrls: string[];
  priceHistory: Array<{ timestamp: string; price: number }>;
  neighborhoodSummary?: string;
};
