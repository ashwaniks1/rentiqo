import bcrypt from "bcryptjs";
import type { ListingDetail, ListingSummary, ListingStatus, SearchFilters } from "@rentiqo/contracts";

const SEED_BCRYPT_ROUNDS = 4;

export type Role = "consumer" | "agent" | "admin";

export type UserRecord = {
  userId: string;
  email: string;
  password: string;
  role: Role;
  preferences: {
    notifications: { push: boolean; email: boolean };
    search: SearchFilters;
  };
};

export type SessionRecord = {
  sessionId: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
};

export type ListingRecord = ListingDetail & {
  agentId: string;
  propertyType: string;
  listingStatus: ListingStatus;
  history: Array<{ timestamp: string; price: number; eventType: string }>;
};

export type LeadRecord = {
  leadId: string;
  listingId: string;
  userId: string;
  agentId: string;
  leadType: "contact_request" | "tour_request";
  message?: string;
  preferredWindows?: string[];
  status: "new" | "acknowledged" | "in_progress" | "closed";
  createdAt: string;
  updatedAt: string;
};

export type SavedSearchRecord = {
  savedSearchId: string;
  userId: string;
  queryFingerprint: string;
  channels: { push: boolean; email: boolean };
  criteria: Record<string, unknown>;
};

export type ModerationCaseRecord = {
  caseId: string;
  targetType: "listing" | "user" | "agent";
  targetId: string;
  reasonCode: string;
  severity: "low" | "medium" | "high";
  status: "open" | "reviewing" | "resolved";
  actionTaken?: string;
  resolutionNotes?: string;
  reasonForAction?: string;
  createdAt: string;
  updatedAt: string;
};

export type AuditEventRecord = {
  auditEventId: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  timestamp: string;
  details?: Record<string, unknown>;
};

export type AgentProfileRecord = {
  agentId: string;
  serviceAreas: string[];
  isVerified: boolean;
};

export const db = {
  users: new Map<string, UserRecord>(),
  usersByEmail: new Map<string, string>(),
  sessionsByAccessToken: new Map<string, SessionRecord>(),
  sessionsByRefreshToken: new Map<string, SessionRecord>(),
  listings: new Map<string, ListingRecord>(),
  savedHomesByUser: new Map<string, Set<string>>(),
  savedSearchesByUser: new Map<string, SavedSearchRecord[]>(),
  leads: new Map<string, LeadRecord>(),
  moderationCases: new Map<string, ModerationCaseRecord>(),
  auditEvents: [] as AuditEventRecord[],
  agentProfiles: new Map<string, AgentProfileRecord>()
};

const counters = new Map<string, number>();

function nextId(prefix: string): string {
  const current = counters.get(prefix) ?? 0;
  const next = current + 1;
  counters.set(prefix, next);
  return `${prefix}-${String(next).padStart(4, "0")}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function createListingSummary(listing: ListingRecord): ListingSummary {
  return {
    listingId: listing.listingId,
    price: listing.price,
    beds: listing.beds,
    baths: listing.baths,
    city: listing.city,
    state: listing.state,
    status: listing.status,
    propertyType: listing.propertyType
  };
}

function seedUsers() {
  const hashedPassword = bcrypt.hashSync("password123", SEED_BCRYPT_ROUNDS);
  const seedUsersData: UserRecord[] = [
    {
      userId: "user-0001",
      email: "buyer@rentiqo.dev",
      password: hashedPassword,
      role: "consumer",
      preferences: {
        notifications: { push: true, email: true },
        search: {}
      }
    },
    {
      userId: "agent-0001",
      email: "agent@rentiqo.dev",
      password: hashedPassword,
      role: "agent",
      preferences: {
        notifications: { push: true, email: true },
        search: {}
      }
    },
    {
      userId: "admin-0001",
      email: "admin@rentiqo.dev",
      password: hashedPassword,
      role: "admin",
      preferences: {
        notifications: { push: true, email: true },
        search: {}
      }
    }
  ];

  for (const user of seedUsersData) {
    db.users.set(user.userId, user);
    db.usersByEmail.set(user.email.toLowerCase(), user.userId);
  }

  db.agentProfiles.set("agent-0001", {
    agentId: "agent-0001",
    serviceAreas: ["Austin", "Round Rock"],
    isVerified: true
  });
}

function seedListings() {
  const records: ListingRecord[] = [
    {
      listingId: "listing-1001",
      price: 475000,
      beds: 3,
      baths: 2,
      city: "Austin",
      state: "TX",
      status: "active",
      description: "Updated ranch-style home in north Austin.",
      mediaUrls: ["https://cdn.rentiqo.dev/listings/1001/photo-1.jpg"],
      priceHistory: [
        { timestamp: "2026-05-01T00:00:00.000Z", price: 490000 },
        { timestamp: "2026-05-12T00:00:00.000Z", price: 475000 }
      ],
      agentId: "agent-0001",
      propertyType: "single_family",
      listingStatus: "active",
      history: [
        { timestamp: "2026-05-01T00:00:00.000Z", price: 490000, eventType: "listed" },
        { timestamp: "2026-05-12T00:00:00.000Z", price: 475000, eventType: "price_change" }
      ]
    },
    {
      listingId: "listing-1002",
      price: 520000,
      beds: 4,
      baths: 3,
      city: "Austin",
      state: "TX",
      status: "active",
      description: "Two-story home near schools and transit.",
      mediaUrls: ["https://cdn.rentiqo.dev/listings/1002/photo-1.jpg"],
      priceHistory: [{ timestamp: "2026-05-05T00:00:00.000Z", price: 520000 }],
      agentId: "agent-0001",
      propertyType: "single_family",
      listingStatus: "active",
      history: [{ timestamp: "2026-05-05T00:00:00.000Z", price: 520000, eventType: "listed" }]
    }
  ];

  for (const listing of records) {
    db.listings.set(listing.listingId, listing);
  }
}

export function initializeStore(): void {
  if (db.users.size > 0 || db.listings.size > 0) {
    return;
  }
  seedUsers();
  seedListings();
}

export function createSession(userId: string): SessionRecord {
  const sessionId = nextId("session");
  const createdAt = nowIso();
  const accessToken = `access-${sessionId}-${userId}`;
  const refreshToken = `refresh-${sessionId}-${userId}`;
  const session: SessionRecord = { sessionId, userId, accessToken, refreshToken, createdAt };
  db.sessionsByAccessToken.set(accessToken, session);
  db.sessionsByRefreshToken.set(refreshToken, session);
  return session;
}

export function rotateSessionTokens(refreshToken: string): SessionRecord | null {
  const existing = db.sessionsByRefreshToken.get(refreshToken);
  if (!existing) {
    return null;
  }

  db.sessionsByAccessToken.delete(existing.accessToken);
  db.sessionsByRefreshToken.delete(existing.refreshToken);
  return createSession(existing.userId);
}

export function getUserByAccessToken(token: string): UserRecord | null {
  const session = db.sessionsByAccessToken.get(token);
  if (!session) {
    return null;
  }
  return db.users.get(session.userId) ?? null;
}

export function addAuditEvent(event: Omit<AuditEventRecord, "auditEventId" | "timestamp">): AuditEventRecord {
  const record: AuditEventRecord = {
    auditEventId: nextId("audit"),
    timestamp: nowIso(),
    ...event
  };
  db.auditEvents.push(record);
  return record;
}

export function createLead(
  input: Omit<LeadRecord, "leadId" | "status" | "createdAt" | "updatedAt">
): LeadRecord {
  const createdAt = nowIso();
  const record: LeadRecord = {
    leadId: nextId("lead"),
    status: "new",
    createdAt,
    updatedAt: createdAt,
    ...input
  };
  db.leads.set(record.leadId, record);
  return record;
}

export function listListingSummaries(): ListingSummary[] {
  return Array.from(db.listings.values()).map(createListingSummary);
}

export function getListingSummaryById(listingId: string): ListingSummary | null {
  const listing = db.listings.get(listingId);
  return listing ? createListingSummary(listing) : null;
}
