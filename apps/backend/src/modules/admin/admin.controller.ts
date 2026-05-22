import { getRepository } from "../../repositories/app-repository.js";
import { HttpError } from "../../http/errors.js";
import { requireRole } from "../../http/authz.js";
import type { AuthContext } from "../../http/types.js";

export async function listModerationCases(auth: AuthContext | null) {
  const repository = getRepository();
  requireRole(auth, ["admin"]);
  return {
    items: await repository.listModerationCases()
  };
}

export async function createModerationCase(auth: AuthContext | null, body: unknown) {
  const repository = getRepository();
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

  const record = await repository.createModerationCase({
    targetType: payload.targetType,
    targetId: payload.targetId,
    reasonCode: payload.reasonCode,
    severity: payload.severity
  });
  await repository.addAuditEvent({
    actorId: context.userId,
    action: "admin.moderation.create",
    targetType: payload.targetType,
    targetId: payload.targetId,
    details: { caseId: record.caseId, reasonCode: payload.reasonCode, severity: payload.severity }
  });
  return record;
}

export async function updateModerationCase(auth: AuthContext | null, caseId: string, body: unknown) {
  const repository = getRepository();
  const context = requireRole(auth, ["admin"]);
  const payload = body as {
    status?: "open" | "reviewing" | "resolved";
    actionTaken?: string;
    resolutionNotes?: string;
    reasonForAction?: string;
  };
  const record = await repository.updateModerationCase(caseId, payload);
  if (!record) {
    throw new HttpError(404, "CASE_NOT_FOUND", "Moderation case not found");
  }

  await repository.addAuditEvent({
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
