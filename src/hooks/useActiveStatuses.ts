import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { Estado } from "@/types";

// Backed by GET /estados (farma-te-acerca-api's EstadosService), which only
// returns EstadoSolicitud rows with activo = true — this is the DB-driven
// replacement for a hardcoded frontend estado list, so soft-deleting an
// estado on the backend hides it here without a frontend deploy. Each
// entry carries its stable `codigo` alongside the display `nombre`, since
// callers (e.g. RequestStatusDialog) need to look up transitions/colors by
// codigo, never by the renamable nombre.
export function useActiveStatuses() {
  const [statuses, setStatuses] = React.useState<Estado[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiJson<Estado[]>("/estados")
      .then((data) => {
        if (!cancelled) setStatuses(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "No se pudieron cargar los estados.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { statuses, loading, error };
}
