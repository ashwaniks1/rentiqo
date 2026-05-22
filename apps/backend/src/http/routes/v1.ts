import {
  contactAgent,
  listUserLeads,
  requestTour
} from "../../modules/engagement/engagement.controller.js";
import {
  createSavedSearch,
  deleteSavedSearch,
  listSavedHomes,
  removeSavedHome,
  saveHome,
  updateSavedSearch
} from "../../modules/saved/saved.controller.js";
import {
  createModerationCase,
  getDataQualitySummary,
  listModerationCases,
  updateModerationCase
} from "../../modules/admin/admin.controller.js";
import { getAgentProfile, listAgentLeads, updateLeadStatus } from "../../modules/agent/agent.controller.js";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  updateUserPreferences
} from "../../modules/auth/auth.controller.js";
import { getHealthResponse } from "../../modules/health/health.controller.js";
import { getListingDetail, getListingHistory } from "../../modules/listings/listing.controller.js";
import { searchListings } from "../../modules/search/search.controller.js";
import { createErrorEnvelope } from "../errors.js";
import type { RequestContext, RouteResult } from "../types.js";

function routeNotFound(): RouteResult {
  return {
    statusCode: 404,
    body: {
      code: "NOT_FOUND",
      message: "Route not found"
    }
  };
}

function parsePathMatch(path: string, pattern: RegExp) {
  const matches = pattern.exec(path);
  return matches;
}

export async function routeV1(request: RequestContext): Promise<RouteResult> {
  const { method, path } = request;
  try {
    if (method === "GET" && path === "/v1/health") {
      return { statusCode: 200, body: getHealthResponse() };
    }

    if (method === "POST" && path === "/v1/auth/register") {
      return { statusCode: 201, body: await registerUser(request.body) };
    }
    if (method === "POST" && path === "/v1/auth/login") {
      return { statusCode: 200, body: await loginUser(request.body) };
    }
    if (method === "POST" && path === "/v1/auth/refresh") {
      return { statusCode: 200, body: await refreshSession(request.body) };
    }
    if (method === "POST" && path === "/v1/auth/logout") {
      return { statusCode: 200, body: await logoutUser(request.auth, request.headers.authorization) };
    }
    if (method === "GET" && path === "/v1/me") {
      return { statusCode: 200, body: await getCurrentUser(request.auth) };
    }
    if (method === "PATCH" && path === "/v1/me/preferences") {
      return { statusCode: 200, body: await updateUserPreferences(request.auth, request.body) };
    }
    if (method === "GET" && path === "/v1/me/leads") {
      return { statusCode: 200, body: await listUserLeads(request.auth) };
    }

    if (method === "POST" && path === "/v1/search/listings") {
      return { statusCode: 200, body: await searchListings(request) };
    }

    if (method === "GET" && path === "/v1/saved-homes") {
      return { statusCode: 200, body: await listSavedHomes(request.auth) };
    }
    if (method === "POST" && path === "/v1/saved-homes") {
      return { statusCode: 201, body: await saveHome(request.auth, request.body) };
    }

    const savedHomeDeleteMatch = parsePathMatch(path, /^\/v1\/saved-homes\/([^/]+)$/);
    if (method === "DELETE" && savedHomeDeleteMatch) {
      return { statusCode: 200, body: await removeSavedHome(request.auth, savedHomeDeleteMatch[1]) };
    }

    if (method === "POST" && path === "/v1/saved-searches") {
      return { statusCode: 201, body: await createSavedSearch(request.auth, request.body) };
    }

    const savedSearchMatch = parsePathMatch(path, /^\/v1\/saved-searches\/([^/]+)$/);
    if (method === "PATCH" && savedSearchMatch) {
      return { statusCode: 200, body: await updateSavedSearch(request.auth, savedSearchMatch[1], request.body) };
    }
    if (method === "DELETE" && savedSearchMatch) {
      return { statusCode: 200, body: await deleteSavedSearch(request.auth, savedSearchMatch[1]) };
    }

    const listingContactMatch = parsePathMatch(path, /^\/v1\/listings\/([^/]+)\/contact-agent$/);
    if (method === "POST" && listingContactMatch) {
      return { statusCode: 201, body: await contactAgent(request.auth, listingContactMatch[1], request.body) };
    }
    const listingTourMatch = parsePathMatch(path, /^\/v1\/listings\/([^/]+)\/tour-requests$/);
    if (method === "POST" && listingTourMatch) {
      return { statusCode: 201, body: await requestTour(request.auth, listingTourMatch[1], request.body) };
    }

    if (method === "GET" && path === "/v1/agent/me/leads") {
      return { statusCode: 200, body: await listAgentLeads(request.auth) };
    }
    if (method === "GET" && path === "/v1/agent/me/profile") {
      return { statusCode: 200, body: await getAgentProfile(request.auth) };
    }
    const agentLeadMatch = parsePathMatch(path, /^\/v1\/agent\/leads\/([^/]+)$/);
    if (method === "PATCH" && agentLeadMatch) {
      return { statusCode: 200, body: await updateLeadStatus(request.auth, agentLeadMatch[1], request.body) };
    }

    if (method === "GET" && path === "/v1/admin/moderation/cases") {
      return { statusCode: 200, body: await listModerationCases(request.auth) };
    }
    if (method === "POST" && path === "/v1/admin/moderation/cases") {
      return { statusCode: 201, body: await createModerationCase(request.auth, request.body) };
    }
    const moderationCaseMatch = parsePathMatch(path, /^\/v1\/admin\/moderation\/cases\/([^/]+)$/);
    if (method === "PATCH" && moderationCaseMatch) {
      return { statusCode: 200, body: await updateModerationCase(request.auth, moderationCaseMatch[1], request.body) };
    }
    if (method === "GET" && path === "/v1/admin/data-quality/summary") {
      return { statusCode: 200, body: getDataQualitySummary(request.auth) };
    }

    const listingHistoryMatch = parsePathMatch(path, /^\/v1\/listings\/([^/]+)\/history$/);
    if (method === "GET" && listingHistoryMatch) {
      return { statusCode: 200, body: await getListingHistory(listingHistoryMatch[1]) };
    }

    const listingMatch = parsePathMatch(path, /^\/v1\/listings\/([^/]+)$/);
    if (method === "GET" && listingMatch) {
      return { statusCode: 200, body: await getListingDetail(listingMatch[1]) };
    }

    return routeNotFound();
  } catch (error) {
    return createErrorEnvelope(error);
  }
}
