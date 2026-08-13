import { ClipboardList, Plus, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRequests } from "@/context/RequestsContext";
import type { RequestHistoryEntry } from "@/types";

export function HistoryPage() {
  const { history, loading, error } = useRequests();
  const navigate = useNavigate();
  const location = useLocation();
  const confirmation =
    (location.state as { confirmation?: RequestHistoryEntry } | null)?.confirmation ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Mis solicitudes de relocalización</h1>
          <p className="text-sm text-stone-500">
            Consultá el estado de tus solicitudes o cargá una nueva.
          </p>
        </div>
        <Button
          onClick={() => navigate("/colaborador/nueva")}
          className="shrink-0 gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
        >
          <Plus className="h-4 w-4" /> Nueva solicitud
        </Button>
      </div>

      {confirmation && (
        <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            Solicitud exitosa — N° <strong>{confirmation.id}</strong>, estado:{" "}
            <strong>{confirmation.status}</strong>.
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de solicitudes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <p className="py-6 text-center text-sm text-stone-400">Cargando historial...</p>
          ) : error ? (
            <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : history.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Todavía no cargaste ninguna solicitud"
              description="Cuando cargues una solicitud de relocalización, vas a poder ver su estado acá."
              actionLabel="Cargar solicitud"
              onAction={() => navigate("/colaborador/nueva")}
            />
          ) : (
            history.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between rounded-md border border-stone-100 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-800">{h.branch}</p>
                  <p className="text-xs text-stone-500">
                    N° {h.id} · {h.date}
                  </p>
                </div>
                <StatusBadge status={h.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
