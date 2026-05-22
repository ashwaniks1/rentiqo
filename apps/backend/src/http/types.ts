import type { Role, UserRecord } from "../data/store.js";

export type AuthContext = {
  userId: string;
  role: Role;
  email: string;
};

export type RequestContext = {
  method: string;
  url: URL;
  path: string;
  headers: Record<string, string | undefined>;
  body: unknown;
  auth: AuthContext | null;
};

export type RouteResult = {
  statusCode: number;
  body: unknown;
};

export function toAuthContext(user: UserRecord): AuthContext {
  return {
    userId: user.userId,
    role: user.role,
    email: user.email
  };
}
