import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { HCRequest } from "@/types";

export function useHcRequests(desiredBranchId: string | null) {
  const [requests, setRequests] = React.useState<HCRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const query = desiredBranchId ? `?desiredBranchId=${desiredBranchId}` : "";
    apiJson<HCRequest[]>(`/hc/requests${query}`)
      .then((data) => {
        if (!cancelled) setRequests(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "No se pudieron cargar las solicitudes.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [desiredBranchId]);

  const updateRequest = (updated: HCRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  return { requests, loading, error, updateRequest };
}
