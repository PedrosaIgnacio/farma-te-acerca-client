import * as React from "react";

import { apiJson } from "@/lib/api";
import { clearSession, readSession, writeSession } from "@/lib/session";
import type { LoginResponse, Session } from "@/types";

interface AuthContextValue {
  session: Session | null;
  login: (legajo: string, password: string) => Promise<Session>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(readSession);

  const login = React.useCallback(async (legajo: string, password: string) => {
    const response = await apiJson<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ legajo, password }),
    });
    const next: Session = {
      user: response.user.fullName,
      role: response.user.role,
      accessToken: response.accessToken,
    };
    writeSession(next);
    setSession(next);
    return next;
  }, []);

  const logout = React.useCallback(() => {
    clearSession();
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
