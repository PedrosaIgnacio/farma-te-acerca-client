import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { Branch } from "@/types";

// Backs the Sucursales ABM (GET /hc/branches) — unlike useBranches.ts (the
// public, active-only GET /branches used by NewRequestPage/DT), this
// returns every sucursal regardless of `activa` so HC can find and
// reactivate one.
export function useHcBranches() {
  const [branches, setBranches] = React.useState<Branch[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiJson<Branch[]>("/hc/branches")
      .then((data) => {
        if (!cancelled) setBranches(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "No se pudieron cargar las sucursales.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addBranch = (created: Branch) => {
    setBranches((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const updateBranch = (updated: Branch) => {
    setBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  return { branches, loading, error, addBranch, updateBranch };
}
