import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AuthUser = {
  email: string;
  name: string;
};

type StoredUser = {
  email: string;
  name: string;
  password: string;
  createdAt: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AUTH_SESSION_KEY = 'bb:auth:session';
const AUTH_USERS_KEY = 'bb:auth:users';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function readSession(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (!user) {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(readSession());
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = name.trim();

    if (!normalizedName) throw new Error('Nom requis');
    if (!normalizedEmail) throw new Error('Email requis');
    if (!password) throw new Error('Mot de passe requis');

    const users = readUsers();
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) throw new Error('Un compte existe déjà avec cet email');

    const newUser: StoredUser = {
      email: normalizedEmail,
      name: normalizedName,
      password,
      createdAt: new Date().toISOString(),
    };

    writeUsers([newUser, ...users]);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) throw new Error('Email requis');
    if (!password) throw new Error('Mot de passe requis');

    const users = readUsers();
    const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (!found || found.password !== password) {
      throw new Error('Email ou mot de passe incorrect');
    }

    const sessionUser: AuthUser = {
      email: found.email,
      name: found.name,
    };

    setUser(sessionUser);
    writeSession(sessionUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    writeSession(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
    };
  }, [user, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
