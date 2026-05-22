import type { UserRole } from "./auth.service.js";

export type RbacContext = {
  actorRole: UserRole;
  actorId: string;
  requiredRoles: UserRole[];
  resource: string;
};

export type RbacResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      reason: "FORBIDDEN";
      details: string;
    };

export function enforceRbacGuard(context: RbacContext): RbacResult {
  if (context.requiredRoles.includes(context.actorRole)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: "FORBIDDEN",
    details: `Actor ${context.actorId} (${context.actorRole}) cannot access ${context.resource}`
  };
}
