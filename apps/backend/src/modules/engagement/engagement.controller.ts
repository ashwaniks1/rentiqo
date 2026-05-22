import { createLead, db } from "../../data/store.js";
import { HttpError } from "../../http/errors.js";
import { requireAuth } from "../../http/authz.js";
import type { AuthContext } from "../../http/types.js";

export function contactAgent(auth: AuthContext | null, listingId: string, body: unknown) {
  const context = requireAuth(auth);
  const payload = body as { message?: string; contactPreference?: string };
  if (!db.listings.has(listingId)) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  const listing = db.listings.get(listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }

  const lead = createLead({
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

export function requestTour(auth: AuthContext | null, listingId: string, body: unknown) {
  const context = requireAuth(auth);
  const payload = body as { preferredWindows?: string[]; notes?: string };
  if (!db.listings.has(listingId)) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }
  const listing = db.listings.get(listingId);
  if (!listing) {
    throw new HttpError(404, "LISTING_NOT_FOUND", "Listing not found");
  }

  const lead = createLead({
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

export function listUserLeads(auth: AuthContext | null) {
  const context = requireAuth(auth);
  const leads = Array.from(db.leads.values()).filter((lead) => lead.userId === context.userId);
  return {
    items: leads
  };
}
