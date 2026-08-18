import * as React from "react";
import { Outlet } from "react-router-dom";

import { ApiError, apiJson } from "@/lib/api";
import type { CurrentUserResponse, NewRequestInput, RequestHistoryEntry } from "@/types";

interface RequestsContextValue {
  history: RequestHistoryEntry[];
  loading: boolean;
  error: string | null;
  addRequest: (input: NewRequestInput) => Promise<RequestHistoryEntry>;
  currentBranchId: number | null;
  currentBranchLoading: boolean;
}

const RequestsContext = React.createContext<RequestsContextValue | null>(null);

export function RequestsProvider() {
  const [history, setHistory] = React.useState<RequestHistoryEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentBranchId, setCurrentBranchId] = React.useState<number | null>(null);
  const [currentBranchLoading, setCurrentBranchLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiJson<RequestHistoryEntry[]>("/requests")
      .then((data) => {
        if (!cancelled) setHistory(data);
      })
      .catch((err) => {
        if (!cancelled)
          setError(err instanceof ApiError ? err.message : "No se pudo cargar el historial.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    setCurrentBranchLoading(true);
    apiJson<CurrentUserResponse>("/auth/me")
      .then((data) => {
        if (!cancelled) setCurrentBranchId(data.currentBranchId);
      })
      .finally(() => {
        if (!cancelled) setCurrentBranchLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const addRequest = React.useCallback(async (input: NewRequestInput) => {
    const entry = await apiJson<RequestHistoryEntry>("/requests", {
      method: "POST",
      body: JSON.stringify(input),
    });
    setHistory((prev) => [entry, ...prev]);
    return entry;
  }, []);

  const value = React.useMemo(
    () => ({ history, loading, error, addRequest, currentBranchId, currentBranchLoading }),
    [history, loading, error, addRequest, currentBranchId, currentBranchLoading],
  );

  return (
    <RequestsContext.Provider value={value}>
      <Outlet />
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const ctx = React.useContext(RequestsContext);
  if (!ctx) throw new Error("useRequests must be used within a RequestsProvider");
  return ctx;
}
