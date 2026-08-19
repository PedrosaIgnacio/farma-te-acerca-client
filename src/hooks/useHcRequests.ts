import * as React from "react";

import { ApiError, apiJson } from "@/lib/api";
import type { HCRequest } from "@/types";

export function useHcRequests() {
  const [branchId, setBranchId] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [requests, setRequests] = React.useState<HCRequest[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const search = async () => {
    if (!branchId) return;
    setShow(true);
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<HCRequest[]>(`/hc/requests?desiredBranchId=${branchId}`);
      setRequests(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudieron cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  const updateRequest = (updated: HCRequest) => {
    setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  return { branchId, setBranchId, show, requests, loading, error, search, updateRequest };
}
