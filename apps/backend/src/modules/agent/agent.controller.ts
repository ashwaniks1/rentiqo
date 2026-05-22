import { addAuditEvent, db } from "../../data/store.js";
import { HttpError } from "../../http/errors.js";
import { requireRole } from "../../http/authz.js";
import type { AuthContext } from "../../http/types.js";

export function listAgentLeads(auth: AuthContext | null) {
  const context = requireRole(auth, ["agent"]);
  const leads = Array.from(db.leads.values()).filter((lead) => lead.agentId === context.userId);
  return {
    items: leads
  };
}

export function updateLeadStatus(auth: AuthContext | null, leadId: string, body: unknown) {
  const context = requireRole(auth, ["agent"]);
  const payload = body as { status?: "new" | "acknowledged" | "in_progress" | "closed"; notes?: string };
  if (!payload?.status) {
    throw new HttpError(400, "INVALID_REQUEST", "status is required");
  }
  const lead = db.leads.get(leadId);
  if (!lead || lead.agentId !== context.userId) {
    throw new HttpError(404, "LEAD_NOT_FOUND", "Lead not found");
  }
  lead.status = payload.status;
  lead.updatedAt = new Date().toISOString();
  addAuditEvent({
    actorId: context.userId,
    action: "agent.lead.status.update",
    targetType: "lead",
    targetId: leadId,
    details: { status: payload.status, notes: payload.notes }
  });
  return lead;
}

export function getAgentProfile(auth: AuthContext | null) {
  const context = requireRole(auth, ["agent"]);
  const profile = db.agentProfiles.get(context.userId);
  if (!profile) {
    throw new HttpError(404, "AGENT_PROFILE_NOT_FOUND", "Agent profile not found");
  }
  return profile;
}
