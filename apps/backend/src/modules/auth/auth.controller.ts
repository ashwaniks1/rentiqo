import type { Role } from "../../data/store.js";
import { HttpError } from "../../http/errors.js";
import type { AuthContext } from "../../http/types.js";
import { getRepository } from "../../repositories/app-repository.js";

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

  const existing = await repository.getUserByEmail(payload.email);
  if (existing) {
    throw new HttpError(409, "EMAIL_EXISTS", "Email already registered");
  }

  const role = payload.role === "agent" || payload.role === "admin" ? payload.role : "consumer";
  const created = await repository.createUser(payload.email, payload.password, role);
  const session = await repository.createSession(created.userId);
  return toAuthPayload(created.userId, session.accessToken, session.refreshToken);
}

export async function loginUser(body: unknown): Promise<AuthPayload> {
  const repository = getRepository();
  const payload = body as { email?: string; password?: string };
  if (!payload?.email || !payload?.password) {
    throw new HttpError(400, "INVALID_REQUEST", "email and password are required");
  }

  const user = await repository.getUserByEmail(payload.email);
  if (!user) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  if (user.password !== payload.password) {
    throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

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
