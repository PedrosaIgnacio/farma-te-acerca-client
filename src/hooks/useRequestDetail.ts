import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { RequestDetail } from "@/types";

export function useRequestDetail(id: string | undefined) {
  const [request, setRequest] = React.useState<RequestDetail | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiJson<RequestDetail>(`/requests/${id}`)
      .then((data) => {
        if (!cancelled) setRequest(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "No se pudo cargar la solicitud.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { request, loading, error };
}
