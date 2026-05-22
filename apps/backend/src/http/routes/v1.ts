import type { IncomingMessage } from "node:http";
import { getHealthResponse } from "../../modules/health/health.controller.js";
import { getAuthService, type UserProfile } from "../../modules/auth/auth.service.js";
import { enforceRbacGuard } from "../../modules/auth/rbac.js";
import { emitAuditEvent } from "../../modules/audit/audit.hooks.js";
import { getEngagementService } from "../../modules/engagement/engagement.service.js";
import { getListingDetail, getListingHistory } from "../../modules/listings/listing.controller.js";
import { getSavedStateService } from "../../modules/saved-state/saved-state.service.js";
import { searchListings } from "../../modules/search/search.controller.js";

type RouteRequest = Pick<IncomingMessage, "method" | "url" | "headers"> & {
  body?: unknown;
  traceId?: string;
};

type RouteResponse = {
  statusCode: number;
  body: Record<string, unknown>;
};

function createError(
  traceId: string,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): RouteResponse {
  return {
    statusCode,
    body: {
      code,
      message,
      trace_id: traceId,
      ...(details ? { details } : {})
    }
  };
}

function asObject(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function parseAuthorizationToken(headers: IncomingMessage["headers"]): string | null {
  const headerValue = headers.authorization;
  const authHeader = Array.isArray(headerValue) ? headerValue[0] : headerValue;
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice("Bearer ".length).trim();
}

function parseIdempotencyKey(headers: IncomingMessage["headers"]): string | null {
  const headerValue = headers["idempotency-key"];
  if (typeof headerValue === "string") {
    return headerValue.trim() || null;
  }
  if (Array.isArray(headerValue)) {
    return headerValue[0]?.trim() || null;
  }
  return null;
}

function authorize(
  request: RouteRequest,
  traceId: string,
  requiredRoles: Array<"consumer" | "agent" | "admin">
): { user: UserProfile } | { error: RouteResponse } {
  const authService = getAuthService();
  const accessToken = parseAuthorizationToken(request.headers);
  if (!accessToken) {
    return { error: createError(traceId, 401, "UNAUTHORIZED", "Missing bearer token") };
  }

  const user = authService.getUserByAccessToken(accessToken);
  if (!user) {
    return { error: createError(traceId, 401, "UNAUTHORIZED", "Invalid bearer token") };
  }

  const rbac = enforceRbacGuard({
    actorId: user.userId,
    actorRole: user.role,
    requiredRoles,
    resource: request.url ?? "/"
  });
  if (!rbac.allowed) {
    return {
      error: createError(traceId, 403, "FORBIDDEN", "Role is not allowed for this endpoint", {
        rbacReason: rbac.details
      })
    };
  }

  return { user };
}

export async function routeV1(request: RouteRequest): Promise<RouteResponse> {
  const method = request.method ?? "GET";
  const requestUrl = new URL(request.url ?? "/", "http://localhost");
  const path = requestUrl.pathname;
  const traceId = request.traceId ?? `trace-${Date.now().toString(36)}`;
  const body = asObject(request.body);
  const authService = getAuthService();
  const savedStateService = getSavedStateService();
  const engagementService = getEngagementService();

  if (method === "GET" && path === "/v1/health") {
    return { statusCode: 200, body: { ...getHealthResponse(), trace_id: traceId } };
  }

  if (method === "POST" && path === "/v1/auth/register") {
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = body.role === "agent" || body.role === "admin" ? body.role : "consumer";

    if (!email || !password) {
      return createError(traceId, 400, "VALIDATION_ERROR", "email and password are required");
    }

    try {
      const result = authService.register({ email, password, role });
      emitAuditEvent({
        action: "auth.register",
        actorId: result.user.userId,
        actorRole: result.user.role,
        resource: "user",
        resourceId: result.user.userId,
        outcome: "success",
        traceId
      });
      return {
        statusCode: 201,
        body: {
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          user: result.user
        }
      };
    } catch (error) {
      if (error instanceof Error && error.message === "EMAIL_EXISTS") {
        return createError(traceId, 409, "EMAIL_EXISTS", "A user with this email already exists");
      }
      return createError(traceId, 500, "INTERNAL_ERROR", "Could not register user");
    }
  }

  if (method === "POST" && path === "/v1/auth/login") {
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (!email || !password) {
      return createError(traceId, 400, "VALIDATION_ERROR", "email and password are required");
    }

    try {
      const result = authService.login({ email, password });
      emitAuditEvent({
        action: "auth.login",
        actorId: result.user.userId,
        actorRole: result.user.role,
        resource: "session",
        outcome: "success",
        traceId
      });
      return {
        statusCode: 200,
        body: {
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          user: result.user
        }
      };
    } catch {
      return createError(traceId, 401, "INVALID_CREDENTIALS", "Email or password is incorrect");
    }
  }

  if (method === "POST" && path === "/v1/auth/refresh") {
    const refreshToken = typeof body.refreshToken === "string" ? body.refreshToken : "";
    if (!refreshToken) {
      return createError(traceId, 400, "VALIDATION_ERROR", "refreshToken is required");
    }

    try {
      const result = authService.refresh(refreshToken);
      emitAuditEvent({
        action: "auth.refresh",
        actorId: result.user.userId,
        actorRole: result.user.role,
        resource: "session",
        outcome: "success",
        traceId
      });
      return {
        statusCode: 200,
        body: {
          accessToken: result.tokens.accessToken,
          refreshToken: result.tokens.refreshToken,
          user: result.user
        }
      };
    } catch {
      return createError(traceId, 401, "INVALID_REFRESH_TOKEN", "Refresh token is invalid or expired");
    }
  }

  if (method === "GET" && path === "/v1/me") {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    return {
      statusCode: 200,
      body: {
        user: authResult.user
      }
    };
  }

  if (method === "PATCH" && path === "/v1/me/preferences") {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    const preferences = asObject(body.preferences ?? body);
    try {
      const user = authService.updatePreferences(authResult.user.userId, preferences);
      emitAuditEvent({
        action: "profile.preferences.update",
        actorId: user.userId,
        actorRole: user.role,
        resource: "preferences",
        resourceId: user.userId,
        outcome: "success",
        traceId,
        metadata: { updatedFields: Object.keys(preferences) }
      });
      return {
        statusCode: 200,
        body: {
          preferences: user.preferences
        }
      };
    } catch {
      return createError(traceId, 404, "NOT_FOUND", "User not found");
    }
  }

  if (method === "POST" && path === "/v1/search/listings") {
    return { statusCode: 200, body: searchListings(body) };
  }

  const listingRouteMatch = path.match(/^\/v1\/listings\/([^/]+)(?:\/(history|contact-agent|tour-requests))?$/);
  if (listingRouteMatch) {
    const [, listingId, operation] = listingRouteMatch;

    if (method === "GET" && !operation) {
      const listing = getListingDetail(listingId);
      if (!listing) {
        return createError(traceId, 404, "NOT_FOUND", "Listing not found", { listingId });
      }
      return { statusCode: 200, body: listing };
    }

    if (method === "GET" && operation === "history") {
      const history = getListingHistory(listingId);
      if (!history) {
        return createError(traceId, 404, "NOT_FOUND", "Listing history not found", { listingId });
      }
      return { statusCode: 200, body: { listingId, events: history } };
    }

    if (method === "POST" && operation === "contact-agent") {
      const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
      if ("error" in authResult) {
        return authResult.error;
      }
      const idempotencyKey = parseIdempotencyKey(request.headers);
      if (!idempotencyKey) {
        return createError(traceId, 400, "VALIDATION_ERROR", "idempotency-key header is required");
      }

      const message = typeof body.message === "string" ? body.message : "";
      const contactPreference =
        body.contactPreference === "phone" || body.contactPreference === "sms" ? body.contactPreference : "email";
      if (!message) {
        return createError(traceId, 400, "VALIDATION_ERROR", "message is required");
      }

      const lead = engagementService.createContactAgentRequest({
        userId: authResult.user.userId,
        listingId,
        message,
        contactPreference,
        idempotencyKey
      });
      emitAuditEvent({
        action: "engagement.contact_agent.create",
        actorId: authResult.user.userId,
        actorRole: authResult.user.role,
        resource: "lead",
        resourceId: lead.leadId,
        outcome: "success",
        traceId
      });
      return {
        statusCode: 201,
        body: {
          leadId: lead.leadId,
          status: lead.status
        }
      };
    }

    if (method === "POST" && operation === "tour-requests") {
      const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
      if ("error" in authResult) {
        return authResult.error;
      }
      const idempotencyKey = parseIdempotencyKey(request.headers);
      if (!idempotencyKey) {
        return createError(traceId, 400, "VALIDATION_ERROR", "idempotency-key header is required");
      }
      const preferredTimeWindows = Array.isArray(body.preferredTimeWindows)
        ? body.preferredTimeWindows.filter((value): value is string => typeof value === "string")
        : [];
      if (preferredTimeWindows.length === 0) {
        return createError(traceId, 400, "VALIDATION_ERROR", "preferredTimeWindows is required");
      }

      const notes = typeof body.notes === "string" ? body.notes : undefined;
      const tourRequest = engagementService.createTourRequest({
        userId: authResult.user.userId,
        listingId,
        preferredTimeWindows,
        notes,
        idempotencyKey
      });

      emitAuditEvent({
        action: "engagement.tour_request.create",
        actorId: authResult.user.userId,
        actorRole: authResult.user.role,
        resource: "tour_request",
        resourceId: tourRequest.tourRequestId,
        outcome: "success",
        traceId
      });
      return {
        statusCode: 201,
        body: {
          tourRequestId: tourRequest.tourRequestId,
          status: tourRequest.status
        }
      };
    }
  }

  if (method === "GET" && path === "/v1/saved-homes") {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    const savedHomes = savedStateService.listSavedHomes(authResult.user.userId);
    return {
      statusCode: 200,
      body: {
        items: savedHomes.map((savedHome) => ({
          ...savedHome,
          listing: getListingDetail(savedHome.listingId)
        }))
      }
    };
  }

  if (method === "POST" && path === "/v1/saved-homes") {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    const listingId = typeof body.listingId === "string" ? body.listingId : "";
    if (!listingId) {
      return createError(traceId, 400, "VALIDATION_ERROR", "listingId is required");
    }

    const savedHome = savedStateService.createSavedHome(authResult.user.userId, listingId);
    emitAuditEvent({
      action: "saved_home.create",
      actorId: authResult.user.userId,
      actorRole: authResult.user.role,
      resource: "saved_home",
      resourceId: listingId,
      outcome: "success",
      traceId
    });
    return {
      statusCode: 201,
      body: {
        savedHomeId: `${savedHome.userId}:${savedHome.listingId}`,
        listingId: savedHome.listingId,
        savedAt: savedHome.savedAt
      }
    };
  }

  if (method === "DELETE" && path.startsWith("/v1/saved-homes/")) {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    const listingId = path.replace("/v1/saved-homes/", "");
    const deleted = savedStateService.deleteSavedHome(authResult.user.userId, listingId);
    return {
      statusCode: deleted ? 200 : 404,
      body: deleted
        ? { deleted: true, listingId }
        : {
            code: "NOT_FOUND",
            message: "Saved home not found",
            trace_id: traceId,
            details: { listingId }
          }
    };
  }

  if (method === "GET" && path === "/v1/saved-searches") {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    return {
      statusCode: 200,
      body: {
        items: savedStateService.listSavedSearches(authResult.user.userId)
      }
    };
  }

  if (method === "POST" && path === "/v1/saved-searches") {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    const name = typeof body.name === "string" ? body.name : "Untitled search";
    const queryFingerprint = typeof body.queryFingerprint === "string" ? body.queryFingerprint : "";
    const query = asObject(body.query);
    const channels: Array<"email" | "push" | "sms"> = Array.isArray(body.channels)
      ? body.channels.filter((channel): channel is "email" | "push" | "sms" => {
          return channel === "email" || channel === "push" || channel === "sms";
        })
      : ["email"];
    if (!queryFingerprint) {
      return createError(traceId, 400, "VALIDATION_ERROR", "queryFingerprint is required");
    }

    const savedSearch = savedStateService.createSavedSearch({
      userId: authResult.user.userId,
      name,
      queryFingerprint,
      query,
      channels
    });
    emitAuditEvent({
      action: "saved_search.create",
      actorId: authResult.user.userId,
      actorRole: authResult.user.role,
      resource: "saved_search",
      resourceId: savedSearch.savedSearchId,
      outcome: "success",
      traceId
    });

    return {
      statusCode: 201,
      body: savedSearch
    };
  }

  if (method === "PATCH" && path.startsWith("/v1/saved-searches/")) {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }

    const savedSearchId = path.replace("/v1/saved-searches/", "");
    const patch: Record<string, unknown> = {};
    if (typeof body.name === "string") {
      patch.name = body.name;
    }
    if (typeof body.queryFingerprint === "string") {
      patch.queryFingerprint = body.queryFingerprint;
    }
    if (body.query && typeof body.query === "object") {
      patch.query = body.query;
    }
    if (Array.isArray(body.channels)) {
      patch.channels = body.channels.filter((channel): channel is "email" | "push" | "sms" => {
        return channel === "email" || channel === "push" || channel === "sms";
      });
    }

    const updated = savedStateService.updateSavedSearch(authResult.user.userId, savedSearchId, patch);
    if (!updated) {
      return createError(traceId, 404, "NOT_FOUND", "Saved search not found", { savedSearchId });
    }
    return {
      statusCode: 200,
      body: updated
    };
  }

  if (method === "DELETE" && path.startsWith("/v1/saved-searches/")) {
    const authResult = authorize(request, traceId, ["consumer", "agent", "admin"]);
    if ("error" in authResult) {
      return authResult.error;
    }
    const savedSearchId = path.replace("/v1/saved-searches/", "");
    const deleted = savedStateService.deleteSavedSearch(authResult.user.userId, savedSearchId);
    return {
      statusCode: deleted ? 200 : 404,
      body: deleted
        ? { deleted: true, savedSearchId }
        : {
            code: "NOT_FOUND",
            message: "Saved search not found",
            trace_id: traceId,
            details: { savedSearchId }
          }
    };
  }

  return createError(traceId, 404, "NOT_FOUND", "Route not found");
}
