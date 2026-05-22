import { addAuditEvent, db } from "../../data/store.js";
import { HttpError } from "../../http/errors.js";
import { requireRole } from "../../http/authz.js";
import type { AuthContext } from "../../http/types.js";

export function listModerationCases(auth: AuthContext | null) {
  requireRole(auth, ["admin"]);
  return {
    items: Array.from(db.moderationCases.values())
  };
}

export function createModerationCase(auth: AuthContext | null, body: unknown) {
  const context = requireRole(auth, ["admin"]);
  const payload = body as {
    targetType?: "listing" | "user" | "agent";
    targetId?: string;
    reasonCode?: string;
    severity?: "low" | "medium" | "high";
  };
  if (!payload?.targetType || !payload?.targetId || !payload?.reasonCode || !payload?.severity) {
    throw new HttpError(400, "INVALID_REQUEST", "targetType, targetId, reasonCode, and severity are required");
  }

  const caseId = `case-${String(db.moderationCases.size + 1).padStart(4, "0")}`;
  const timestamp = new Date().toISOString();
  const record = {
    caseId,
    targetType: payload.targetType,
    targetId: payload.targetId,
    reasonCode: payload.reasonCode,
    severity: payload.severity,
    status: "open" as const,
    createdAt: timestamp,
    updatedAt: timestamp
  };
  db.moderationCases.set(caseId, record);
  addAuditEvent({
    actorId: context.userId,
    action: "admin.moderation.create",
    targetType: payload.targetType,
    targetId: payload.targetId,
    details: { caseId, reasonCode: payload.reasonCode, severity: payload.severity }
  });
  return record;
}

export function updateModerationCase(auth: AuthContext | null, caseId: string, body: unknown) {
  const context = requireRole(auth, ["admin"]);
  const payload = body as {
    status?: "open" | "reviewing" | "resolved";
    actionTaken?: string;
    resolutionNotes?: string;
    reasonForAction?: string;
  };
  const record = db.moderationCases.get(caseId);
  if (!record) {
    throw new HttpError(404, "CASE_NOT_FOUND", "Moderation case not found");
  }
  if (payload.status) {
    record.status = payload.status;
  }
  if (payload.actionTaken) {
    record.actionTaken = payload.actionTaken;
  }
  if (payload.resolutionNotes) {
    record.resolutionNotes = payload.resolutionNotes;
  }
  if (payload.reasonForAction) {
    record.reasonForAction = payload.reasonForAction;
  }
  record.updatedAt = new Date().toISOString();

  addAuditEvent({
    actorId: context.userId,
    action: "admin.moderation.update",
    targetType: "moderation_case",
    targetId: caseId,
    details: payload as Record<string, unknown>
  });

  return record;
}

export function getDataQualitySummary(auth: AuthContext | null) {
  requireRole(auth, ["admin"]);
  return {
    freshnessCompliance: 96.1,
    duplicateRate: 1.4,
    completenessScore: 98.7,
    ingestionSuccessRatio: 99.2
  };
}
