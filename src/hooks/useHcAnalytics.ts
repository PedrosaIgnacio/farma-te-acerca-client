import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { AnalyticsFilters, AnalyticsResponse } from "@/types";

export function useHcAnalytics(filters: AnalyticsFilters | null) {
  const params = React.useMemo(() => {
    if (!filters) return "";
    const p = new URLSearchParams();
    if (filters.from) p.set("from", filters.from);
    if (filters.to) p.set("to", filters.to);
    if (filters.region) p.set("region", filters.region);
    return p.toString();
  }, [filters]);

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
