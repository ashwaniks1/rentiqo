import { getRepository } from "../../repositories/app-repository.js";
import { HttpError } from "../../http/errors.js";
import { requireAuth } from "../../http/authz.js";
import type { AuthContext } from "../../http/types.js";

export async function contactAgent(auth: AuthContext | null, listingId: string, body: unknown) {
  const repository = getRepository();
  const context = requireAuth(auth);
  const payload = body as { message?: string; contactPreference?: string };
  const listing = await repository.getListingDetailById(listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }

  const lead = await repository.createLead({
    listingId,
    userId: context.userId,
    agentId: listing.agentId,
    leadType: "contact_request",
    message: payload?.message
  });

  return {
    leadId: lead.leadId,
    status: lead.status,
    contactPreference: payload?.contactPreference ?? "message"
  };
}

export async function requestTour(auth: AuthContext | null, listingId: string, body: unknown) {
  const repository = getRepository();
  const context = requireAuth(auth);
  const payload = body as { preferredWindows?: string[]; notes?: string };
  const listing = await repository.getListingDetailById(listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }

  const lead = await repository.createLead({
    listingId,
    userId: context.userId,
    agentId: listing.agentId,
    leadType: "tour_request",
    message: payload?.notes,
    preferredWindows: payload?.preferredWindows ?? []
  });

  return {
    tourRequestId: `tour-${lead.leadId}`,
    leadId: lead.leadId,
    status: lead.status
  };
}

export async function listUserLeads(auth: AuthContext | null) {
  const repository = getRepository();
  const context = requireAuth(auth);
  const leads = await repository.listUserLeads(context.userId);
  return {
    items: leads
  };
}
