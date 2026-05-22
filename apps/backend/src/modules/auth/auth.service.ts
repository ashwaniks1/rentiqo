import { randomUUID } from "node:crypto";

export type UserRole = "consumer" | "agent" | "admin";

export type UserPreferences = {
  emailNotifications: boolean;
  pushNotifications: boolean;
  savedSearchDigest: "off" | "daily" | "weekly";
  preferredPropertyTypes: string[];
};

export type UserRecord = {
  userId: string;
  email: string;
  password: string;
  role: UserRole;
  preferences: UserPreferences;
  createdAt: string;
};

export type UserProfile = Omit<UserRecord, "password">;

type SessionRecord = {
  userId: string;
  accessToken: string;
  refreshToken: string;
  issuedAt: string;
};

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

function defaultPreferences(): UserPreferences {
  return {
    emailNotifications: true,
    pushNotifications: false,
    savedSearchDigest: "daily",
    preferredPropertyTypes: ["house", "condo"]
  };
}

function sanitizeUser(user: UserRecord): UserProfile {
  const { password: _password, ...profile } = user;
  return profile;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

class InMemoryAuthService {
  private readonly usersById = new Map<string, UserRecord>();
  private readonly userIdByEmail = new Map<string, string>();
  private readonly sessionByAccessToken = new Map<string, SessionRecord>();
  private readonly sessionByRefreshToken = new Map<string, SessionRecord>();

  public constructor() {
    this.seedDefaultUsers();
  }

  public register(params: {
    email: string;
    password: string;
    role?: UserRole;
  }): { tokens: AuthTokens; user: UserProfile } {
    const normalizedEmail = normalizeEmail(params.email);
    if (this.userIdByEmail.has(normalizedEmail)) {
      throw new Error("EMAIL_EXISTS");
    }

    const userId = `user-${randomUUID()}`;
    const user: UserRecord = {
      userId,
      email: normalizedEmail,
      password: params.password,
      role: params.role ?? "consumer",
      preferences: defaultPreferences(),
      createdAt: new Date().toISOString()
    };

    this.usersById.set(userId, user);
    this.userIdByEmail.set(normalizedEmail, userId);

    return {
      tokens: this.issueTokens(userId),
      user: sanitizeUser(user)
    };
  }

  public login(params: { email: string; password: string }): { tokens: AuthTokens; user: UserProfile } {
    const normalizedEmail = normalizeEmail(params.email);
    const userId = this.userIdByEmail.get(normalizedEmail);
    if (!userId) {
      throw new Error("INVALID_CREDENTIALS");
    }

    const user = this.usersById.get(userId);
    if (!user || user.password !== params.password) {
      throw new Error("INVALID_CREDENTIALS");
    }

    return {
      tokens: this.issueTokens(user.userId),
      user: sanitizeUser(user)
    };
  }

  public refresh(refreshToken: string): { tokens: AuthTokens; user: UserProfile } {
    const existingSession = this.sessionByRefreshToken.get(refreshToken);
    if (!existingSession) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }
    const user = this.usersById.get(existingSession.userId);
    if (!user) {
      throw new Error("INVALID_REFRESH_TOKEN");
    }

    this.sessionByAccessToken.delete(existingSession.accessToken);
    this.sessionByRefreshToken.delete(existingSession.refreshToken);

    return {
      tokens: this.issueTokens(user.userId),
      user: sanitizeUser(user)
    };
  }

  public getUserByAccessToken(accessToken: string): UserProfile | null {
    const session = this.sessionByAccessToken.get(accessToken);
    if (!session) {
      return null;
    }

    const user = this.usersById.get(session.userId);
    return user ? sanitizeUser(user) : null;
  }

  public getUserById(userId: string): UserProfile | null {
    const user = this.usersById.get(userId);
    return user ? sanitizeUser(user) : null;
  }

  public updatePreferences(userId: string, preferences: Partial<UserPreferences>): UserProfile {
    const user = this.usersById.get(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    user.preferences = { ...user.preferences, ...preferences };
    return sanitizeUser(user);
  }

  private issueTokens(userId: string): AuthTokens {
    const accessToken = `at_${randomUUID()}`;
    const refreshToken = `rt_${randomUUID()}`;
    const session: SessionRecord = {
      userId,
      accessToken,
      refreshToken,
      issuedAt: new Date().toISOString()
    };
    this.sessionByAccessToken.set(accessToken, session);
    this.sessionByRefreshToken.set(refreshToken, session);
    return { accessToken, refreshToken };
  }

  private seedDefaultUsers(): void {
    const users: UserRecord[] = [
      {
        userId: "user-seed-consumer",
        email: "consumer@rentiqo.dev",
        password: "pass-123",
        role: "consumer",
        preferences: defaultPreferences(),
        createdAt: "2026-05-20T10:00:00.000Z"
      },
      {
        userId: "user-seed-agent",
        email: "agent@rentiqo.dev",
        password: "pass-123",
        role: "agent",
        preferences: defaultPreferences(),
        createdAt: "2026-05-20T10:00:00.000Z"
      },
      {
        userId: "user-seed-admin",
        email: "admin@rentiqo.dev",
        password: "pass-123",
        role: "admin",
        preferences: defaultPreferences(),
        createdAt: "2026-05-20T10:00:00.000Z"
      }
    ];

    for (const user of users) {
      this.usersById.set(user.userId, user);
      this.userIdByEmail.set(user.email, user.userId);
      this.issueTokens(user.userId);
    }
  }
}

let authService: InMemoryAuthService | null = null;

export function getAuthService(): InMemoryAuthService {
  if (!authService) {
    authService = new InMemoryAuthService();
  }
  return authService;
}
