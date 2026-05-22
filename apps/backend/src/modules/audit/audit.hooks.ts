import { logInfo } from "../../lib/logger.js";

export type AuditEvent = {
  action: string;
  actorId: string;
  actorRole?: string;
  resource: string;
  resourceId?: string;
  outcome: "success" | "failure";
  traceId: string;
  metadata?: Record<string, unknown>;
};

export function emitAuditEvent(event: AuditEvent): void {
  logInfo("audit_event", event);
}
