export type SearchFilters = {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  propertyTypes?: string[];
  statuses?: string[];
};

export type SearchLocation = {
  latitude?: number;
  longitude?: number;
  radiusMiles?: number;
  bbox?: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  polygon?: Array<{
    latitude: number;
    longitude: number;
  }>;
  city?: string;
  state?: string;
};

export type SearchRequest = {
  query?: string;
  location?: SearchLocation;
  filters?: SearchFilters;
  sort?: "relevance" | "price_asc" | "price_desc" | "newest";
  limit?: number;
  cursor?: string | null;
};

export type SearchResponse<TListing> = {
  items: TListing[];
  mapPoints: Array<{
    listingId: string;
    latitude: number;
    longitude: number;
  }>;
  nextCursor: string | null;
  appliedFilters: SearchFilters;
  ranking: {
    version: string;
  };
};
