import type { ListingDetail } from "@rentiqo/contracts";

export type SearchListingDocument = ListingDetail & {
  sourceProvider: string;
  updatedAt: string;
  location: {
    latitude: number;
    longitude: number;
  };
  propertyType: "house" | "condo" | "townhome" | "multi_family" | "apartment" | "land";
  postalCode: string;
  daysOnMarket: number;
};

export interface ListingDataset {
  getListings(): SearchListingDocument[];
  getListingById(listingId: string): SearchListingDocument | null;
}

export class InMemoryListingDataset implements ListingDataset {
  public constructor(private readonly listings: SearchListingDocument[]) {}

  public getListings(): SearchListingDocument[] {
    return this.listings.map((listing) => ({ ...listing }));
  }

  public getListingById(listingId: string): SearchListingDocument | null {
    const listing = this.listings.find((item) => item.listingId === listingId);
    return listing ? { ...listing } : null;
  }
}

const seededListings: SearchListingDocument[] = [
  {
    listingId: "demo-listing-1001",
    sourceProvider: "rentiqo-seed",
    status: "active",
    price: 475000,
    beds: 3,
    baths: 2,
    propertyType: "house",
    city: "Austin",
    state: "TX",
    postalCode: "78704",
    location: { latitude: 30.244, longitude: -97.768 },
    updatedAt: "2026-05-20T12:00:00.000Z",
    hasPriceReduction: true,
    daysOnMarket: 14,
    schoolScore: 8.1,
    mediaUrls: [
      "https://cdn.rentiqo.dev/listings/demo-listing-1001/front.jpg",
      "https://cdn.rentiqo.dev/listings/demo-listing-1001/kitchen.jpg"
    ],
    description: "Updated South Austin home near parks and coffee shops.",
    neighborhoodSummary: "South Lamar with walkable amenities and fast downtown access.",
    priceHistory: [
      { timestamp: "2026-05-01T10:00:00.000Z", price: 489000 },
      { timestamp: "2026-05-20T12:00:00.000Z", price: 475000 }
    ]
  },
  {
    listingId: "demo-listing-1002",
    sourceProvider: "rentiqo-seed",
    status: "active",
    price: 520000,
    beds: 4,
    baths: 3,
    propertyType: "house",
    city: "Austin",
    state: "TX",
    postalCode: "78702",
    location: { latitude: 30.264, longitude: -97.719 },
    updatedAt: "2026-05-21T08:45:00.000Z",
    hasPriceReduction: false,
    daysOnMarket: 7,
    schoolScore: 7.5,
    mediaUrls: [
      "https://cdn.rentiqo.dev/listings/demo-listing-1002/front.jpg",
      "https://cdn.rentiqo.dev/listings/demo-listing-1002/patio.jpg"
    ],
    description: "East Austin modern build with rooftop deck.",
    neighborhoodSummary: "East Austin entertainment district with nightlife and bike lanes.",
    priceHistory: [{ timestamp: "2026-05-21T08:45:00.000Z", price: 520000 }]
  },
  {
    listingId: "demo-listing-1003",
    sourceProvider: "rentiqo-seed",
    status: "pending",
    price: 430000,
    beds: 2,
    baths: 2,
    propertyType: "condo",
    city: "Round Rock",
    state: "TX",
    postalCode: "78664",
    location: { latitude: 30.518, longitude: -97.677 },
    updatedAt: "2026-05-19T16:15:00.000Z",
    hasPriceReduction: false,
    daysOnMarket: 22,
    schoolScore: 7,
    mediaUrls: ["https://cdn.rentiqo.dev/listings/demo-listing-1003/front.jpg"],
    description: "Two-bedroom condo with community pool and gym.",
    neighborhoodSummary: "Suburban pocket with quick access to major highways.",
    priceHistory: [{ timestamp: "2026-05-19T16:15:00.000Z", price: 430000 }]
  },
  {
    listingId: "demo-listing-1004",
    sourceProvider: "rentiqo-seed",
    status: "active",
    price: 389000,
    beds: 3,
    baths: 2,
    propertyType: "townhome",
    city: "Austin",
    state: "TX",
    postalCode: "78758",
    location: { latitude: 30.396, longitude: -97.713 },
    updatedAt: "2026-05-22T03:30:00.000Z",
    hasPriceReduction: true,
    daysOnMarket: 5,
    schoolScore: 8.4,
    mediaUrls: ["https://cdn.rentiqo.dev/listings/demo-listing-1004/front.jpg"],
    description: "Recently renovated townhome near The Domain.",
    neighborhoodSummary: "North Austin employment corridor with transit and shopping.",
    priceHistory: [
      { timestamp: "2026-05-16T08:00:00.000Z", price: 399000 },
      { timestamp: "2026-05-22T03:30:00.000Z", price: 389000 }
    ]
  }
];

export function createSeededListingDataset(): ListingDataset {
  return new InMemoryListingDataset(seededListings);
}
