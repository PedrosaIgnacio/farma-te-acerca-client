import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { HcCollaborator } from "@/types";

export function useHcCollaborators() {
  const [collaborators, setCollaborators] = React.useState<HcCollaborator[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiJson<HcCollaborator[]>("/hc/collaborators")
      .then((data) => {
        if (!cancelled) setCollaborators(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "No se pudieron cargar los colaboradores.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { collaborators, loading, error };
}
