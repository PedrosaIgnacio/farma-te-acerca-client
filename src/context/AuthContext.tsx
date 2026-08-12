import * as React from "react";

import type { Role, Session } from "@/types";

const SESSION_STORAGE_KEY = "farma-te-acerca:session";

interface AuthContextValue {
  session: Session | null;
  login: (user: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

function readStoredSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(readStoredSession);

  const login = React.useCallback((user: string, role: Role) => {
    const next: Session = { user, role };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(next));
    setSession(next);
  }, []);

  const logout = React.useCallback(() => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setSession(null);
  }, []);

  const value = React.useMemo(() => ({ session, login, logout }), [session, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
