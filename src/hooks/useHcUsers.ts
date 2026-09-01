import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { HcUser } from "@/types";

// Backs the Colaboradores ABM (GET /hc/users) — spans all 3 roles and both
// active/inactive, unlike useHcCollaborators.ts (which stays scoped to
// active `collaborator`-role people for the "solicitar en nombre de"
// select and is left untouched).
export function useHcUsers() {
  const [users, setUsers] = React.useState<HcUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiJson<HcUser[]>("/hc/users")
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "No se pudieron cargar los colaboradores.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addUser = (created: HcUser) => {
    setUsers((prev) => [...prev, created].sort((a, b) => a.nombre.localeCompare(b.nombre)));
  };

  const updateUser = (updated: HcUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
  };

  return { users, loading, error, addUser, updateUser };
}
