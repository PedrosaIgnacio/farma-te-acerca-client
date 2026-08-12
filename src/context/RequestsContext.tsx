import * as React from "react";
import { Outlet } from "react-router-dom";

import { INITIAL_HISTORY } from "@/data/mockData";
import type { RequestHistoryEntry } from "@/types";

interface RequestsContextValue {
  history: RequestHistoryEntry[];
  hasExistingRequest: (branch: string) => RequestHistoryEntry | undefined;
  addRequest: (branch: string) => RequestHistoryEntry;
}

const RequestsContext = React.createContext<RequestsContextValue | null>(null);

export function RequestsProvider() {
  const [history, setHistory] = React.useState<RequestHistoryEntry[]>(INITIAL_HISTORY);

  const hasExistingRequest = React.useCallback(
    (branch: string) =>
      history.find(
        (h) => h.branch === branch && (h.status === "Activa" || h.status === "En curso"),
      ),
    [history],
  );

  const addRequest = React.useCallback((branch: string) => {
    const newEntry: RequestHistoryEntry = {
      id: 1000 + Math.floor(Math.random() * 500),
      branch,
      date: new Date().toLocaleDateString("es-AR"),
      status: "En curso",
    };
    setHistory((prev) => [newEntry, ...prev]);
    return newEntry;
  }, []);

  const value = React.useMemo(
    () => ({ history, hasExistingRequest, addRequest }),
    [history, hasExistingRequest, addRequest],
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
