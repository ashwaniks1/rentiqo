import type { ListingDetail, ListingSummary, SearchFilters } from "@rentiqo/contracts";
import type { Pool } from "pg";
import { getDatabaseConfig, type DataStoreMode } from "../config/database.js";
import { getDbPool } from "../db/client.js";
import { runMigrations } from "../db/run-migrations.js";
import {
  addAuditEvent,
  createLead,
  createSession,
  db,
  getListingSummaryById,
  getUserByAccessToken as getMemoryUserByAccessToken,
  initializeStore,
  listListingSummaries,
  rotateSessionTokens,
  type AgentProfileRecord,
  type AuditEventRecord,
  type LeadRecord,
  type ModerationCaseRecord,
  type Role,
  type SavedSearchRecord,
  type SessionRecord,
  type UserRecord
} from "../data/store.js";

type SessionWithUser = SessionRecord & { user: UserRecord };

type CreateModerationCaseInput = {
  targetType: "listing" | "user" | "agent";
  targetId: string;
  reasonCode: string;
  severity: "low" | "medium" | "high";
};

type UpdateModerationCaseInput = {
  status?: "open" | "reviewing" | "resolved";
  actionTaken?: string;
  resolutionNotes?: string;
  reasonForAction?: string;
};

type UpdatePreferencesInput = {
  notifications?: { push?: boolean; email?: boolean };
  search?: Record<string, unknown>;
};

type CreateSavedSearchInput = {
  queryFingerprint: string;
  channels: { push: boolean; email: boolean };
  criteria: Record<string, unknown>;
};

type UpdateSavedSearchInput = {
  queryFingerprint?: string;
  channels?: { push?: boolean; email?: boolean };
  criteria?: Record<string, unknown>;
};

type CreateLeadInput = Omit<LeadRecord, "leadId" | "status" | "createdAt" | "updatedAt">;

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toNotifications(value: unknown) {
  const fallback = { push: true, email: true };
  if (!value || typeof value !== "object") {
    return fallback;
  }
  const parsed = value as { push?: boolean; email?: boolean };
  return {
    push: parsed.push ?? fallback.push,
    email: parsed.email ?? fallback.email
  };
}

function toSearchFilters(value: unknown): SearchFilters {
  if (!value || typeof value !== "object") {
    return {};
  }
  return value as SearchFilters;
}

function toUserRecord(row: Record<string, unknown>): UserRecord {
  return {
    userId: String(row.user_id),
    email: String(row.email),
    password: String(row.password),
    role: row.role as Role,
    preferences: {
      notifications: toNotifications(row.notifications),
      search: toSearchFilters(row.search)
    }
  };
}

function toListingDetail(row: Record<string, unknown>): ListingDetail & {
  agentId: string;
  propertyType: string;
  listingStatus: string;
  history: Array<{ timestamp: string; price: number; eventType: string }>;
} {
  return {
    listingId: String(row.listing_id),
    price: Number(row.price),
    beds: Number(row.beds),
    baths: Number(row.baths),
    city: String(row.city),
    state: String(row.state),
    status: String(row.status) as ListingSummary["status"],
    description: row.description ? String(row.description) : undefined,
    mediaUrls: (row.media_urls as string[]) ?? [],
    priceHistory: (row.price_history as Array<{ timestamp: string; price: number }>) ?? [],
    agentId: String(row.agent_id),
    propertyType: String(row.property_type),
    listingStatus: String(row.listing_status),
    history: (row.history as Array<{ timestamp: string; price: number; eventType: string }>) ?? []
  };
}

class MemoryRepository {
  readonly mode: DataStoreMode = "memory";

  async initialize() {
    initializeStore();
  }

  async getUserByAccessToken(token: string): Promise<UserRecord | null> {
    return getMemoryUserByAccessToken(token);
  }

  async getUserById(userId: string): Promise<UserRecord | null> {
    return db.users.get(userId) ?? null;
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const userId = db.usersByEmail.get(email.toLowerCase());
    return userId ? db.users.get(userId) ?? null : null;
  }

  async createUser(email: string, password: string, role: Role): Promise<UserRecord> {
    const userId = createId("user");
    const user: UserRecord = {
      userId,
      email,
      password,
      role,
      preferences: {
        notifications: { push: true, email: true },
        search: {}
      }
    };
    db.users.set(userId, user);
    db.usersByEmail.set(email.toLowerCase(), userId);
    return user;
  }

  async createSession(userId: string): Promise<SessionRecord> {
    return createSession(userId);
  }

  async rotateSession(refreshToken: string): Promise<SessionRecord | null> {
    return rotateSessionTokens(refreshToken);
  }

  async revokeSessionByAccessToken(accessToken: string): Promise<boolean> {
    const session = db.sessionsByAccessToken.get(accessToken);
    if (!session) {
      return false;
    }
    db.sessionsByAccessToken.delete(accessToken);
    db.sessionsByRefreshToken.delete(session.refreshToken);
    return true;
  }

  async updateUserPreferences(userId: string, input: UpdatePreferencesInput): Promise<UserRecord | null> {
    const user = db.users.get(userId);
    if (!user) {
      return null;
    }
    user.preferences = {
      notifications: {
        push: input.notifications?.push ?? user.preferences.notifications.push,
        email: input.notifications?.email ?? user.preferences.notifications.email
      },
      search: {
        ...user.preferences.search,
        ...(input.search ?? {})
      }
    };
    return user;
  }

  async listListingSummaries(): Promise<ListingSummary[]> {
    return listListingSummaries();
  }

  async getListingDetailById(listingId: string) {
    const listing = db.listings.get(listingId);
    return listing ?? null;
  }

  async listSavedHomes(userId: string): Promise<ListingSummary[]> {
    const savedHomes = Array.from(db.savedHomesByUser.get(userId) ?? []);
    return savedHomes
      .map((listingId) => getListingSummaryById(listingId))
      .filter((item): item is ListingSummary => Boolean(item));
  }

  async saveHome(userId: string, listingId: string) {
    const saved = db.savedHomesByUser.get(userId) ?? new Set<string>();
    saved.add(listingId);
    db.savedHomesByUser.set(userId, saved);
    return { saved_home_id: `${userId}-${listingId}`, listingId };
  }

  async removeSavedHome(userId: string, listingId: string) {
    db.savedHomesByUser.get(userId)?.delete(listingId);
  }

  async createSavedSearch(userId: string, input: CreateSavedSearchInput): Promise<SavedSearchRecord> {
    const records = db.savedSearchesByUser.get(userId) ?? [];
    const savedSearch: SavedSearchRecord = {
      savedSearchId: createId("saved-search"),
      userId,
      queryFingerprint: input.queryFingerprint,
      channels: input.channels,
      criteria: input.criteria
    };
    records.push(savedSearch);
    db.savedSearchesByUser.set(userId, records);
    return savedSearch;
  }

  async updateSavedSearch(userId: string, savedSearchId: string, input: UpdateSavedSearchInput) {
    const records = db.savedSearchesByUser.get(userId) ?? [];
    const target = records.find((record) => record.savedSearchId === savedSearchId);
    if (!target) {
      return null;
    }
    if (input.queryFingerprint) {
      target.queryFingerprint = input.queryFingerprint;
    }
    if (input.criteria) {
      target.criteria = { ...target.criteria, ...input.criteria };
    }
    if (input.channels) {
      target.channels = {
        push: input.channels.push ?? target.channels.push,
        email: input.channels.email ?? target.channels.email
      };
    }
    return target;
  }

  async deleteSavedSearch(userId: string, savedSearchId: string) {
    const records = db.savedSearchesByUser.get(userId) ?? [];
    db.savedSearchesByUser.set(
      userId,
      records.filter((record) => record.savedSearchId !== savedSearchId)
    );
  }

  async createLead(input: CreateLeadInput): Promise<LeadRecord> {
    return createLead(input);
  }

  async listUserLeads(userId: string) {
    return Array.from(db.leads.values()).filter((lead) => lead.userId === userId);
  }

  async listAgentLeads(agentId: string) {
    return Array.from(db.leads.values()).filter((lead) => lead.agentId === agentId);
  }

  async updateLeadStatus(agentId: string, leadId: string, status: LeadRecord["status"]) {
    const lead = db.leads.get(leadId);
    if (!lead || lead.agentId !== agentId) {
      return null;
    }
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
    return lead;
  }

  async getAgentProfile(agentId: string): Promise<AgentProfileRecord | null> {
    return db.agentProfiles.get(agentId) ?? null;
  }

  async listModerationCases(): Promise<ModerationCaseRecord[]> {
    return Array.from(db.moderationCases.values());
  }

  async createModerationCase(input: CreateModerationCaseInput): Promise<ModerationCaseRecord> {
    const record: ModerationCaseRecord = {
      caseId: createId("case"),
      targetType: input.targetType,
      targetId: input.targetId,
      reasonCode: input.reasonCode,
      severity: input.severity,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.moderationCases.set(record.caseId, record);
    return record;
  }

  async updateModerationCase(caseId: string, input: UpdateModerationCaseInput) {
    const record = db.moderationCases.get(caseId);
    if (!record) {
      return null;
    }
    if (input.status) {
      record.status = input.status;
    }
    if (input.actionTaken) {
      record.actionTaken = input.actionTaken;
    }
    if (input.resolutionNotes) {
      record.resolutionNotes = input.resolutionNotes;
    }
    if (input.reasonForAction) {
      record.reasonForAction = input.reasonForAction;
    }
    record.updatedAt = new Date().toISOString();
    return record;
  }

  async addAuditEvent(event: Omit<AuditEventRecord, "auditEventId" | "timestamp">) {
    return addAuditEvent(event);
  }
}

class PostgresRepository {
  readonly mode: DataStoreMode = "postgres";
  private readonly pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async initialize() {
    await runMigrations(this.pool);
  }

  async getUserByAccessToken(token: string): Promise<UserRecord | null> {
    const result = await this.pool.query(
      `
      select u.user_id, u.email, u.password, u.role, p.notifications, p.search
      from sessions s
      join users u on u.user_id = s.user_id
      join user_preferences p on p.user_id = u.user_id
      where s.access_token = $1
      `,
      [token]
    );
    if ((result.rowCount ?? 0) === 0) {
      return null;
    }
    return toUserRecord(result.rows[0] as Record<string, unknown>);
  }

  async getUserById(userId: string): Promise<UserRecord | null> {
    const result = await this.pool.query(
      `
      select u.user_id, u.email, u.password, u.role, p.notifications, p.search
      from users u
      join user_preferences p on p.user_id = u.user_id
      where u.user_id = $1
      `,
      [userId]
    );
    if ((result.rowCount ?? 0) === 0) {
      return null;
    }
    return toUserRecord(result.rows[0] as Record<string, unknown>);
  }

  async getUserByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.pool.query(
      `
      select u.user_id, u.email, u.password, u.role, p.notifications, p.search
      from users u
      join user_preferences p on p.user_id = u.user_id
      where lower(u.email) = $1
      `,
      [email.toLowerCase()]
    );
    if ((result.rowCount ?? 0) === 0) {
      return null;
    }
    return toUserRecord(result.rows[0] as Record<string, unknown>);
  }

  async createUser(email: string, password: string, role: Role): Promise<UserRecord> {
    const userId = createId("user");
    await this.pool.query("begin");
    try {
      await this.pool.query("insert into users (user_id, email, password, role) values ($1, $2, $3, $4)", [
        userId,
        email,
        password,
        role
      ]);
      await this.pool.query(
        "insert into user_preferences (user_id, notifications, search) values ($1, $2::jsonb, $3::jsonb)",
        [userId, JSON.stringify({ push: true, email: true }), JSON.stringify({})]
      );
      await this.pool.query("commit");
    } catch (error) {
      await this.pool.query("rollback");
      throw error;
    }
    const created = await this.getUserById(userId);
    if (!created) {
      throw new Error("Failed to create user");
    }
    return created;
  }

  async createSession(userId: string): Promise<SessionRecord> {
    const sessionId = createId("session");
    const accessToken = `access-${sessionId}-${userId}`;
    const refreshToken = `refresh-${sessionId}-${userId}`;
    const result = await this.pool.query(
      `
      insert into sessions (session_id, user_id, access_token, refresh_token, created_at)
      values ($1, $2, $3, $4, now())
      returning session_id, user_id, access_token, refresh_token, created_at
      `,
      [sessionId, userId, accessToken, refreshToken]
    );
    return {
      sessionId: String(result.rows[0].session_id),
      userId: String(result.rows[0].user_id),
      accessToken: String(result.rows[0].access_token),
      refreshToken: String(result.rows[0].refresh_token),
      createdAt: String(result.rows[0].created_at)
    };
  }

  async rotateSession(refreshToken: string): Promise<SessionRecord | null> {
    const existing = await this.pool.query("select user_id from sessions where refresh_token = $1", [refreshToken]);
    if ((existing.rowCount ?? 0) === 0) {
      return null;
    }
    await this.pool.query("delete from sessions where refresh_token = $1", [refreshToken]);
    return this.createSession(String(existing.rows[0].user_id));
  }

  async revokeSessionByAccessToken(accessToken: string): Promise<boolean> {
    const result = await this.pool.query("delete from sessions where access_token = $1", [accessToken]);
    return (result.rowCount ?? 0) > 0;
  }

  async updateUserPreferences(userId: string, input: UpdatePreferencesInput): Promise<UserRecord | null> {
    const current = await this.getUserById(userId);
    if (!current) {
      return null;
    }
    const notifications = {
      push: input.notifications?.push ?? current.preferences.notifications.push,
      email: input.notifications?.email ?? current.preferences.notifications.email
    };
    const search = {
      ...current.preferences.search,
      ...(input.search ?? {})
    };
    await this.pool.query("update user_preferences set notifications = $2::jsonb, search = $3::jsonb where user_id = $1", [
      userId,
      JSON.stringify(notifications),
      JSON.stringify(search)
    ]);
    return this.getUserById(userId);
  }

  async listListingSummaries(): Promise<ListingSummary[]> {
    const result = await this.pool.query(
      "select listing_id, price, beds, baths, city, state, status, property_type from listings order by listing_id asc"
    );
    return result.rows.map((row) => ({
      listingId: String(row.listing_id),
      price: Number(row.price),
      beds: Number(row.beds),
      baths: Number(row.baths),
      city: String(row.city),
      state: String(row.state),
      status: String(row.status) as ListingSummary["status"],
      propertyType: row.property_type ? String(row.property_type) : undefined
    }));
  }

  async getListingDetailById(listingId: string) {
    const result = await this.pool.query("select * from listings where listing_id = $1", [listingId]);
    if ((result.rowCount ?? 0) === 0) {
      return null;
    }
    return toListingDetail(result.rows[0] as Record<string, unknown>);
  }

  async listSavedHomes(userId: string): Promise<ListingSummary[]> {
    const result = await this.pool.query(
      `
      select l.listing_id, l.price, l.beds, l.baths, l.city, l.state, l.status
      from saved_homes s
      join listings l on l.listing_id = s.listing_id
      where s.user_id = $1
      order by s.created_at desc
      `,
      [userId]
    );
    return result.rows.map((row) => ({
      listingId: String(row.listing_id),
      price: Number(row.price),
      beds: Number(row.beds),
      baths: Number(row.baths),
      city: String(row.city),
      state: String(row.state),
      status: String(row.status) as ListingSummary["status"]
    }));
  }

  async saveHome(userId: string, listingId: string) {
    await this.pool.query(
      "insert into saved_homes (user_id, listing_id, created_at) values ($1, $2, now()) on conflict do nothing",
      [userId, listingId]
    );
    return { saved_home_id: `${userId}-${listingId}`, listingId };
  }

  async removeSavedHome(userId: string, listingId: string) {
    await this.pool.query("delete from saved_homes where user_id = $1 and listing_id = $2", [userId, listingId]);
  }

  async createSavedSearch(userId: string, input: CreateSavedSearchInput): Promise<SavedSearchRecord> {
    const savedSearchId = createId("saved-search");
    await this.pool.query(
      `
      insert into saved_searches (saved_search_id, user_id, query_fingerprint, channels, criteria)
      values ($1, $2, $3, $4::jsonb, $5::jsonb)
      `,
      [savedSearchId, userId, input.queryFingerprint, JSON.stringify(input.channels), JSON.stringify(input.criteria)]
    );
    return {
      savedSearchId,
      userId,
      queryFingerprint: input.queryFingerprint,
      channels: input.channels,
      criteria: input.criteria
    };
  }

  async updateSavedSearch(userId: string, savedSearchId: string, input: UpdateSavedSearchInput) {
    const existing = await this.pool.query(
      "select * from saved_searches where saved_search_id = $1 and user_id = $2",
      [savedSearchId, userId]
    );
    if ((existing.rowCount ?? 0) === 0) {
      return null;
    }
    const row = existing.rows[0];
    const channels = {
      push: input.channels?.push ?? toNotifications(row.channels).push,
      email: input.channels?.email ?? toNotifications(row.channels).email
    };
    const criteria = {
      ...(row.criteria as Record<string, unknown>),
      ...(input.criteria ?? {})
    };
    const queryFingerprint = input.queryFingerprint ?? String(row.query_fingerprint);
    await this.pool.query(
      `
      update saved_searches
      set query_fingerprint = $3, channels = $4::jsonb, criteria = $5::jsonb
      where saved_search_id = $1 and user_id = $2
      `,
      [savedSearchId, userId, queryFingerprint, JSON.stringify(channels), JSON.stringify(criteria)]
    );
    return {
      savedSearchId,
      userId,
      queryFingerprint,
      channels,
      criteria
    };
  }

  async deleteSavedSearch(userId: string, savedSearchId: string) {
    await this.pool.query("delete from saved_searches where saved_search_id = $1 and user_id = $2", [
      savedSearchId,
      userId
    ]);
  }

  async createLead(input: CreateLeadInput): Promise<LeadRecord> {
    const leadId = createId("lead");
    const result = await this.pool.query(
      `
      insert into leads (
        lead_id, listing_id, user_id, agent_id, lead_type, message, preferred_windows, status, created_at, updated_at
      )
      values ($1, $2, $3, $4, $5, $6, $7::jsonb, 'new', now(), now())
      returning *
      `,
      [leadId, input.listingId, input.userId, input.agentId, input.leadType, input.message ?? null, JSON.stringify(input.preferredWindows ?? [])]
    );
    const row = result.rows[0];
    return {
      leadId: String(row.lead_id),
      listingId: String(row.listing_id),
      userId: String(row.user_id),
      agentId: String(row.agent_id),
      leadType: row.lead_type as LeadRecord["leadType"],
      message: row.message ? String(row.message) : undefined,
      preferredWindows: (row.preferred_windows as string[]) ?? [],
      status: row.status as LeadRecord["status"],
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at)
    };
  }

  async listUserLeads(userId: string) {
    const result = await this.pool.query("select * from leads where user_id = $1 order by created_at desc", [userId]);
    return result.rows.map((row) => ({
      leadId: String(row.lead_id),
      listingId: String(row.listing_id),
      userId: String(row.user_id),
      agentId: String(row.agent_id),
      leadType: row.lead_type as LeadRecord["leadType"],
      message: row.message ? String(row.message) : undefined,
      preferredWindows: (row.preferred_windows as string[]) ?? [],
      status: row.status as LeadRecord["status"],
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at)
    }));
  }

  async listAgentLeads(agentId: string) {
    const result = await this.pool.query("select * from leads where agent_id = $1 order by created_at desc", [agentId]);
    return result.rows.map((row) => ({
      leadId: String(row.lead_id),
      listingId: String(row.listing_id),
      userId: String(row.user_id),
      agentId: String(row.agent_id),
      leadType: row.lead_type as LeadRecord["leadType"],
      message: row.message ? String(row.message) : undefined,
      preferredWindows: (row.preferred_windows as string[]) ?? [],
      status: row.status as LeadRecord["status"],
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at)
    }));
  }

  async updateLeadStatus(agentId: string, leadId: string, status: LeadRecord["status"]) {
    const result = await this.pool.query(
      "update leads set status = $3, updated_at = now() where lead_id = $1 and agent_id = $2 returning *",
      [leadId, agentId, status]
    );
    if ((result.rowCount ?? 0) === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      leadId: String(row.lead_id),
      listingId: String(row.listing_id),
      userId: String(row.user_id),
      agentId: String(row.agent_id),
      leadType: row.lead_type as LeadRecord["leadType"],
      message: row.message ? String(row.message) : undefined,
      preferredWindows: (row.preferred_windows as string[]) ?? [],
      status: row.status as LeadRecord["status"],
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at)
    };
  }

  async getAgentProfile(agentId: string): Promise<AgentProfileRecord | null> {
    const result = await this.pool.query("select * from agent_profiles where agent_id = $1", [agentId]);
    if ((result.rowCount ?? 0) === 0) {
      return null;
    }
    const row = result.rows[0];
    return {
      agentId: String(row.agent_id),
      serviceAreas: (row.service_areas as string[]) ?? [],
      isVerified: Boolean(row.is_verified)
    };
  }

  async listModerationCases(): Promise<ModerationCaseRecord[]> {
    const result = await this.pool.query("select * from moderation_cases order by created_at desc");
    return result.rows.map((row) => ({
      caseId: String(row.case_id),
      targetType: row.target_type as ModerationCaseRecord["targetType"],
      targetId: String(row.target_id),
      reasonCode: String(row.reason_code),
      severity: row.severity as ModerationCaseRecord["severity"],
      status: row.status as ModerationCaseRecord["status"],
      actionTaken: row.action_taken ? String(row.action_taken) : undefined,
      resolutionNotes: row.resolution_notes ? String(row.resolution_notes) : undefined,
      reasonForAction: row.reason_for_action ? String(row.reason_for_action) : undefined,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at)
    }));
  }

  async createModerationCase(input: CreateModerationCaseInput): Promise<ModerationCaseRecord> {
    const caseId = createId("case");
    const result = await this.pool.query(
      `
      insert into moderation_cases (
        case_id, target_type, target_id, reason_code, severity, status, created_at, updated_at
      )
      values ($1, $2, $3, $4, $5, 'open', now(), now())
      returning *
      `,
      [caseId, input.targetType, input.targetId, input.reasonCode, input.severity]
    );
    const row = result.rows[0];
    return {
      caseId: String(row.case_id),
      targetType: row.target_type as ModerationCaseRecord["targetType"],
      targetId: String(row.target_id),
      reasonCode: String(row.reason_code),
      severity: row.severity as ModerationCaseRecord["severity"],
      status: row.status as ModerationCaseRecord["status"],
      actionTaken: row.action_taken ? String(row.action_taken) : undefined,
      resolutionNotes: row.resolution_notes ? String(row.resolution_notes) : undefined,
      reasonForAction: row.reason_for_action ? String(row.reason_for_action) : undefined,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at)
    };
  }

  async updateModerationCase(caseId: string, input: UpdateModerationCaseInput) {
    const existing = await this.pool.query("select * from moderation_cases where case_id = $1", [caseId]);
    if ((existing.rowCount ?? 0) === 0) {
      return null;
    }
    const row = existing.rows[0];
    const status = input.status ?? (row.status as ModerationCaseRecord["status"]);
    const actionTaken = input.actionTaken ?? (row.action_taken as string | null);
    const resolutionNotes = input.resolutionNotes ?? (row.resolution_notes as string | null);
    const reasonForAction = input.reasonForAction ?? (row.reason_for_action as string | null);
    const result = await this.pool.query(
      `
      update moderation_cases
      set status = $2, action_taken = $3, resolution_notes = $4, reason_for_action = $5, updated_at = now()
      where case_id = $1
      returning *
      `,
      [caseId, status, actionTaken, resolutionNotes, reasonForAction]
    );
    const updated = result.rows[0];
    return {
      caseId: String(updated.case_id),
      targetType: updated.target_type as ModerationCaseRecord["targetType"],
      targetId: String(updated.target_id),
      reasonCode: String(updated.reason_code),
      severity: updated.severity as ModerationCaseRecord["severity"],
      status: updated.status as ModerationCaseRecord["status"],
      actionTaken: updated.action_taken ? String(updated.action_taken) : undefined,
      resolutionNotes: updated.resolution_notes ? String(updated.resolution_notes) : undefined,
      reasonForAction: updated.reason_for_action ? String(updated.reason_for_action) : undefined,
      createdAt: String(updated.created_at),
      updatedAt: String(updated.updated_at)
    };
  }

  async addAuditEvent(event: Omit<AuditEventRecord, "auditEventId" | "timestamp">) {
    const auditEventId = createId("audit");
    const result = await this.pool.query(
      `
      insert into audit_events (audit_event_id, actor_id, action, target_type, target_id, details, timestamp)
      values ($1, $2, $3, $4, $5, $6::jsonb, now())
      returning *
      `,
      [auditEventId, event.actorId, event.action, event.targetType, event.targetId, JSON.stringify(event.details ?? {})]
    );
    const row = result.rows[0];
    return {
      auditEventId: String(row.audit_event_id),
      actorId: String(row.actor_id),
      action: String(row.action),
      targetType: String(row.target_type),
      targetId: String(row.target_id),
      timestamp: String(row.timestamp),
      details: (row.details as Record<string, unknown>) ?? undefined
    };
  }
}

type AppRepository = MemoryRepository | PostgresRepository;

let repository: AppRepository | null = null;

export function getRepository(): AppRepository {
  if (repository) {
    return repository;
  }
  const config = getDatabaseConfig();
  if (config.mode === "postgres") {
    repository = new PostgresRepository(getDbPool());
  } else {
    repository = new MemoryRepository();
  }
  return repository;
}
