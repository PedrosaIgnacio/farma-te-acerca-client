import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { Provincia } from "@/types";

// Read-only lookup for the Sucursal form's provincia Select (GET
// /hc/provincias) — nothing else currently exposes the Provincia catalog
// to the frontend.
export function useHcProvincias() {
  const [provincias, setProvincias] = React.useState<Provincia[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiJson<Provincia[]>("/hc/provincias")
      .then((data) => {
        if (!cancelled) setProvincias(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "No se pudieron cargar las provincias.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { provincias, loading, error };
}
