import { getRepository } from "../../repositories/app-repository.js";
import { HttpError } from "../../http/errors.js";
import { requireRole } from "../../http/authz.js";
import type { AuthContext } from "../../http/types.js";

export async function listAgentLeads(auth: AuthContext | null) {
  const repository = getRepository();
  const context = requireRole(auth, ["agent"]);
  const leads = await repository.listAgentLeads(context.userId);
  return {
    items: leads
  };
}

export async function updateLeadStatus(auth: AuthContext | null, leadId: string, body: unknown) {
  const repository = getRepository();
  const context = requireRole(auth, ["agent"]);
  const payload = body as { status?: "new" | "acknowledged" | "in_progress" | "closed"; notes?: string };
  if (!payload?.status) {
    throw new HttpError(400, "INVALID_REQUEST", "status is required");
  }
  const lead = await repository.updateLeadStatus(context.userId, leadId, payload.status);
  if (!lead) {
    throw new HttpError(404, "LEAD_NOT_FOUND", "Lead not found");
  }
  await repository.addAuditEvent({
    actorId: context.userId,
    action: "agent.lead.status.update",
    targetType: "lead",
    targetId: leadId,
    details: { status: payload.status, notes: payload.notes }
  });
  return lead;
}

export async function getAgentProfile(auth: AuthContext | null) {
  const repository = getRepository();
  const context = requireRole(auth, ["agent"]);
  const profile = await repository.getAgentProfile(context.userId);
  if (!profile) {
    throw new HttpError(404, "AGENT_PROFILE_NOT_FOUND", "Agent profile not found");
  }
  return profile;
}
