import { db, createSession, rotateSessionTokens, type Role } from "../../data/store.js";
import { HttpError } from "../../http/errors.js";
import type { AuthContext } from "../../http/types.js";

type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: {
    userId: string;
    email: string;
    role: Role;
    preferences: {
      notifications: { push: boolean; email: boolean };
      search: Record<string, unknown>;
    };
  };
};

function toAuthPayload(userId: string, accessToken: string, refreshToken: string): AuthPayload {
  const user = db.users.get(userId);
  if (!user) {
    throw new HttpError(404, "USER_NOT_FOUND", "User not found");
  }
  return {
    accessToken,
    refreshToken,
    user: {
      userId: user.userId,
      email: user.email,
      role: user.role,
      preferences: user.preferences
    }
  };
}

export function registerUser(body: unknown): AuthPayload {
  const payload = body as { email?: string; password?: string; role?: Role };
  if (!payload?.email || !payload?.password) {
    throw new HttpError(400, "INVALID_REQUEST", "email and password are required");
  }

  const emailKey = payload.email.toLowerCase();
  if (db.usersByEmail.has(emailKey)) {
    throw new HttpError(409, "EMAIL_EXISTS", "Email already registered");
  }

  const userId = `user-${String(db.users.size + 1).padStart(4, "0")}`;
  const role = payload.role === "agent" || payload.role === "admin" ? payload.role : "consumer";
  db.users.set(userId, {
    userId,
    email: payload.email,
    password: payload.password,
    role,
    preferences: {
      notifications: { push: true, email: true },
      search: {}
    }
  });
  db.usersByEmail.set(emailKey, userId);

  const session = createSession(userId);
  return toAuthPayload(userId, session.accessToken, session.refreshToken);
}

export function loginUser(body: unknown): AuthPayload {
  const payload = body as { email?: string; password?: string };
  if (!payload?.email || !payload?.password) {
    throw new HttpError(400, "INVALID_REQUEST", "email and password are required");
  }

  const userId = db.usersByEmail.get(payload.email.toLowerCase());
  if (!userId) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  const user = db.users.get(userId);
  if (!user || user.password !== payload.password) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  const session = createSession(userId);
  return toAuthPayload(userId, session.accessToken, session.refreshToken);
}

export function refreshSession(body: unknown): AuthPayload {
  const payload = body as { refreshToken?: string };
  if (!payload?.refreshToken) {
    throw new HttpError(400, "INVALID_REQUEST", "refreshToken is required");
  }

  const rotated = rotateSessionTokens(payload.refreshToken);
  if (!rotated) {
    throw new HttpError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }
  return toAuthPayload(rotated.userId, rotated.accessToken, rotated.refreshToken);
}

export function getCurrentUser(auth: AuthContext | null) {
  if (!auth) {
    throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  }
  const user = db.users.get(auth.userId);
  if (!user) {
    throw new HttpError(404, "USER_NOT_FOUND", "User not found");
  }
  return {
    userId: user.userId,
    email: user.email,
    role: user.role,
    preferences: user.preferences
  };
}

export function updateUserPreferences(auth: AuthContext | null, body: unknown) {
  if (!auth) {
    throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  }

  const user = db.users.get(auth.userId);
  if (!user) {
    throw new HttpError(404, "USER_NOT_FOUND", "User not found");
  }

  const payload = body as {
    notifications?: { push?: boolean; email?: boolean };
    search?: Record<string, unknown>;
  };

  user.preferences = {
    notifications: {
      push: payload.notifications?.push ?? user.preferences.notifications.push,
      email: payload.notifications?.email ?? user.preferences.notifications.email
    },
    search: {
      ...user.preferences.search,
      ...(payload.search ?? {})
    }
  };

  return {
    userId: user.userId,
    preferences: user.preferences
  };
}
