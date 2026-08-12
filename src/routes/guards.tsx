import { Navigate, Outlet } from "react-router-dom";

import { AppShell } from "@/components/layout/AppShell";
import { ROLE_HOME } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

export function RequireAuth() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  return <AppShell />;
}

export function RequireRole({ allow }: { allow: Role[] }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (!allow.includes(session.role)) return <Navigate to={ROLE_HOME[session.role]} replace />;
  return <Outlet />;
}

export function RootRedirect() {
  const { session } = useAuth();
  return <Navigate to={session ? ROLE_HOME[session.role] : "/login"} replace />;
}
