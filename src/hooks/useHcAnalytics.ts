import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { AnalyticsResponse } from "@/types";

export interface AnalyticsDateFilter {
  from: string;
  to: string;
}

export function useHcAnalytics(dateFilter: AnalyticsDateFilter | null) {
  const params = React.useMemo(() => {
    if (!dateFilter) return "";
    const p = new URLSearchParams();
    p.set("from", dateFilter.from);
    p.set("to", dateFilter.to);
    return p.toString();
  }, [dateFilter]);

  const [analytics, setAnalytics] = React.useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiJson<AnalyticsResponse>(`/hc/analytics${params ? `?${params}` : ""}`)
      .then((data) => {
        if (!cancelled) setAnalytics(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "No se pudo cargar la analítica.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params]);

  return { analytics, loading, error, params };
}
