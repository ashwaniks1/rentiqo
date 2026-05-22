import type { Role } from "../../data/store.js";
import { HttpError } from "../../http/errors.js";
import type { AuthContext } from "../../http/types.js";
import { getRepository } from "../../repositories/app-repository.js";

const MIN_PASSWORD_LENGTH = 8;
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;

type LoginAttemptState = {
  failures: number;
  lockedUntil: number | null;
};

const loginAttempts = new Map<string, LoginAttemptState>();

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

function normalizeEmail(rawEmail: string): string {
  return rawEmail.trim().toLowerCase();
}

function assertPasswordPolicy(password: string): void {
  const hasLetter = /[a-z]/i.test(password);
  const hasDigit = /\d/.test(password);
  if (password.length < MIN_PASSWORD_LENGTH || !hasLetter || !hasDigit) {
    throw new HttpError(
      400,
      "PASSWORD_POLICY_VIOLATION",
      "Password must be at least 8 characters and include letters and numbers",
      { minLength: MIN_PASSWORD_LENGTH, requiresLetter: true, requiresDigit: true }
    );
  }
}

function getLockoutRemainingSeconds(email: string): number {
  const state = loginAttempts.get(email);
  if (!state?.lockedUntil) {
    return 0;
  }
  return Math.max(1, Math.ceil((state.lockedUntil - Date.now()) / 1000));
}

function assertNotLocked(email: string): void {
  const state = loginAttempts.get(email);
  if (!state?.lockedUntil) {
    return;
  }
  if (state.lockedUntil <= Date.now()) {
    loginAttempts.delete(email);
    return;
  }
  throw new HttpError(429, "ACCOUNT_LOCKED", "Too many failed login attempts", {
    retryAfterSeconds: getLockoutRemainingSeconds(email)
  });
}

function trackFailedLogin(email: string): boolean {
  const existing = loginAttempts.get(email) ?? { failures: 0, lockedUntil: null };
  const failures = existing.failures + 1;
  if (failures >= LOCKOUT_THRESHOLD) {
    loginAttempts.set(email, { failures: 0, lockedUntil: Date.now() + LOCKOUT_WINDOW_MS });
    return true;
  }
  loginAttempts.set(email, { failures, lockedUntil: null });
  return false;
}

function clearLoginFailures(email: string): void {
  loginAttempts.delete(email);
}

function parseAccessToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }
  const [scheme, token] = authorizationHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }
  return token;
}

async function toAuthPayload(userId: string, accessToken: string, refreshToken: string): Promise<AuthPayload> {
  const repository = getRepository();
  const user = await repository.getUserById(userId);
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

export async function registerUser(body: unknown): Promise<AuthPayload> {
  const repository = getRepository();
  const payload = body as { email?: string; password?: string; role?: Role };
  if (!payload?.email || !payload?.password) {
    throw new HttpError(400, "INVALID_REQUEST", "email and password are required");
  }
  const email = normalizeEmail(payload.email);
  assertPasswordPolicy(payload.password);

  const existing = await repository.getUserByEmail(email);
  if (existing) {
    throw new HttpError(409, "EMAIL_EXISTS", "Email already registered");
  }

  const role = payload.role === "agent" || payload.role === "admin" ? payload.role : "consumer";
  const created = await repository.createUser(email, payload.password, role);
  const session = await repository.createSession(created.userId);
  return toAuthPayload(created.userId, session.accessToken, session.refreshToken);
}

export async function loginUser(body: unknown): Promise<AuthPayload> {
  const repository = getRepository();
  const payload = body as { email?: string; password?: string };
  if (!payload?.email || !payload?.password) {
    throw new HttpError(400, "INVALID_REQUEST", "email and password are required");
  }
  const email = normalizeEmail(payload.email);
  assertNotLocked(email);

  const user = await repository.getUserByEmail(email);
  if (!user) {
    const locked = trackFailedLogin(email);
    if (locked) {
      throw new HttpError(429, "ACCOUNT_LOCKED", "Too many failed login attempts", {
        retryAfterSeconds: getLockoutRemainingSeconds(email)
      });
    }
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  if (user.password !== payload.password) {
    const locked = trackFailedLogin(email);
    if (locked) {
      throw new HttpError(429, "ACCOUNT_LOCKED", "Too many failed login attempts", {
        retryAfterSeconds: getLockoutRemainingSeconds(email)
      });
    }
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  clearLoginFailures(email);
  const session = await repository.createSession(user.userId);
  return toAuthPayload(user.userId, session.accessToken, session.refreshToken);
}

export async function refreshSession(body: unknown): Promise<AuthPayload> {
  const repository = getRepository();
  const payload = body as { refreshToken?: string };
  if (!payload?.refreshToken) {
    throw new HttpError(400, "INVALID_REQUEST", "refreshToken is required");
  }

  const rotated = await repository.rotateSession(payload.refreshToken);
  if (!rotated) {
    throw new HttpError(401, "INVALID_REFRESH_TOKEN", "Invalid refresh token");
  }
  return toAuthPayload(rotated.userId, rotated.accessToken, rotated.refreshToken);
}

export async function logoutUser(auth: AuthContext | null, authorizationHeader: string | undefined) {
  const repository = getRepository();
  if (!auth) {
    throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  }
  const accessToken = parseAccessToken(authorizationHeader);
  if (!accessToken) {
    throw new HttpError(400, "INVALID_REQUEST", "Bearer access token is required");
  }
  const revoked = await repository.revokeSessionByAccessToken(accessToken);
  if (!revoked) {
    throw new HttpError(401, "INVALID_SESSION", "Session is invalid or already revoked");
  }
  return { success: true };
}

export async function getCurrentUser(auth: AuthContext | null) {
  const repository = getRepository();
  if (!auth) {
    throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  }
  const user = await repository.getUserById(auth.userId);
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

export async function updateUserPreferences(auth: AuthContext | null, body: unknown) {
  const repository = getRepository();
  if (!auth) {
    throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
  }

  const user = await repository.getUserById(auth.userId);
  if (!user) {
    throw new HttpError(404, "USER_NOT_FOUND", "User not found");
  }

  const payload = body as {
    notifications?: { push?: boolean; email?: boolean };
    search?: Record<string, unknown>;
  };

  const updated = await repository.updateUserPreferences(auth.userId, payload);
  if (!updated) {
    throw new HttpError(404, "USER_NOT_FOUND", "User not found");
  }

  return {
    userId: updated.userId,
    preferences: updated.preferences
  };
}
