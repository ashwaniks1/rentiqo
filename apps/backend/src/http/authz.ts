import { HttpError } from "./errors.js";
import type { AuthContext } from "./types.js";
import type { Role } from "../data/store.js";

export function requireAuth(auth: AuthContext | null): AuthContext {
  if (!auth) {
    throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  }
  return auth;
}

export function requireRole(auth: AuthContext | null, allowedRoles: Role[]): AuthContext {
  const context = requireAuth(auth);
  if (!allowedRoles.includes(context.role)) {
    throw new HttpError(403, "FORBIDDEN", "Insufficient role permissions");
  }
  return context;
}
