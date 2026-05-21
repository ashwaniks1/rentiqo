export type SearchFilters = {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  propertyTypes?: string[];
};

export type SearchRequest = {
  query?: string;
  location?: {
    latitude: number;
    longitude: number;
    radiusMiles?: number;
  };
  filters?: SearchFilters;
  cursor?: string | null;
};

export type SearchResponse<TListing> = {
  items: TListing[];
  nextCursor: string | null;
};
