import { randomUUID } from "node:crypto";

export type ContactAgentRecord = {
  leadId: string;
  userId: string;
  listingId: string;
  message: string;
  contactPreference: "email" | "phone" | "sms";
  status: "received" | "assigned";
  createdAt: string;
  idempotencyKey: string;
};

export type TourRequestRecord = {
  tourRequestId: string;
  userId: string;
  listingId: string;
  preferredTimeWindows: string[];
  notes?: string;
  status: "requested" | "confirmed";
  createdAt: string;
  idempotencyKey: string;
};

class InMemoryEngagementService {
  private readonly contactByIdempotency = new Map<string, ContactAgentRecord>();
  private readonly tourByIdempotency = new Map<string, TourRequestRecord>();

  public createContactAgentRequest(params: {
    userId: string;
    listingId: string;
    message: string;
    contactPreference: "email" | "phone" | "sms";
    idempotencyKey: string;
  }): ContactAgentRecord {
    const dedupeKey = `${params.userId}:${params.listingId}:contact:${params.idempotencyKey}`;
    const existing = this.contactByIdempotency.get(dedupeKey);
    if (existing) {
      return existing;
    }

    const record: ContactAgentRecord = {
      leadId: `lead-${randomUUID()}`,
      userId: params.userId,
      listingId: params.listingId,
      message: params.message,
      contactPreference: params.contactPreference,
      status: "received",
      createdAt: new Date().toISOString(),
      idempotencyKey: params.idempotencyKey
    };
    this.contactByIdempotency.set(dedupeKey, record);
    return record;
  }

  public createTourRequest(params: {
    userId: string;
    listingId: string;
    preferredTimeWindows: string[];
    notes?: string;
    idempotencyKey: string;
  }): TourRequestRecord {
    const dedupeKey = `${params.userId}:${params.listingId}:tour:${params.idempotencyKey}`;
    const existing = this.tourByIdempotency.get(dedupeKey);
    if (existing) {
      return existing;
    }

    const record: TourRequestRecord = {
      tourRequestId: `tour-${randomUUID()}`,
      userId: params.userId,
      listingId: params.listingId,
      preferredTimeWindows: params.preferredTimeWindows,
      notes: params.notes,
      status: "requested",
      createdAt: new Date().toISOString(),
      idempotencyKey: params.idempotencyKey
    };
    this.tourByIdempotency.set(dedupeKey, record);
    return record;
  }
}

let engagementService: InMemoryEngagementService | null = null;

export function getEngagementService(): InMemoryEngagementService {
  if (!engagementService) {
    engagementService = new InMemoryEngagementService();
  }
  return engagementService;
}
