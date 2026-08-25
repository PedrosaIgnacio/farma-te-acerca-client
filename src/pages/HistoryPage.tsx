import * as React from "react";
import { ChevronRight, ClipboardList, MoreVertical, Plus, Search, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { CancelRequestDialog } from "@/components/collaborator/CancelRequestDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useRequests } from "@/context/RequestsContext";
import { CANCELABLE_STATUSES } from "@/data/constants";
import type { RequestHistoryEntry } from "@/types";

export function HistoryPage() {
  const { history, loading, error } = useRequests();
  const navigate = useNavigate();
  const location = useLocation();
  const confirmation =
    (location.state as { confirmation?: RequestHistoryEntry } | null)?.confirmation ?? null;

  const [search, setSearch] = React.useState("");
  const [toCancel, setToCancel] = React.useState<RequestHistoryEntry | null>(null);
  const filteredHistory = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return history;
    return history.filter(
      (h) =>
        h.branch.toLowerCase().includes(term) ||
        h.status.toLowerCase().includes(term) ||
        String(h.id).includes(term),
    );
  }, [history, search]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Mis solicitudes</h1>
        <p className="text-sm text-stone-500">
          Consultá el estado de tus solicitudes o cargá una nueva.
        </p>
      </div>

      <button
        type="button"
        onClick={() => navigate("/colaborador/nueva")}
        className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-5 text-left shadow-sm transition hover:border-[#1F7A4D]/40 hover:shadow-md"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1F7A4D]/10 text-[#1F7A4D]">
          <Plus className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-stone-800">Nueva solicitud</p>
          <p className="text-xs text-stone-500">Cargá una nueva solicitud de relocalización.</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-stone-300" />
      </button>

      {confirmation && (
        <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            Solicitud exitosa — N° <strong>{confirmation.id}</strong>, estado:{" "}
            <strong>{confirmation.status}</strong>.
          </div>
        </div>
      )}

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Solicitudes de relocalización</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por sucursal o estado"
              className="rounded-2xl pl-9"
              disabled={loading || !!error || history.length === 0}
            />
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">N°</th>
                    <th className="px-4 py-3 font-medium">Sucursal deseada</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Fecha</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 3 }, (_, i) => (
                    <tr key={i} className="border-b border-stone-50 last:border-0">
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-4 w-6" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-40" />
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : error ? (
            <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : history.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Todavía no cargaste ninguna solicitud"
              description="Cuando cargues una solicitud de relocalización, vas a poder ver su estado acá."
            />
          ) : filteredHistory.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">
              No se encontraron solicitudes que coincidan con "{search}".
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">N°</th>
                    <th className="px-4 py-3 font-medium">Sucursal deseada</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Fecha</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((h) => (
                    <tr
                      key={h.id}
                      onClick={() => navigate(`/colaborador/solicitudes/${h.id}`)}
                      className="cursor-pointer border-b border-stone-50 last:border-0 hover:bg-stone-50"
                    >
                      <td className="hidden whitespace-nowrap px-4 py-4 text-stone-600 sm:table-cell">
                        {h.id}
                      </td>
                      <td className="max-w-[14rem] truncate px-4 py-4 font-medium text-stone-800">
                        {h.branch}
                      </td>
                      <td className="hidden whitespace-nowrap px-4 py-4 text-stone-600 sm:table-cell">
                        {h.date}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={h.status} />
                      </td>
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        {CANCELABLE_STATUSES.includes(h.status) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="rounded-md p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setToCancel(h)}>
                                Cancelar solicitud
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CancelRequestDialog
        request={toCancel}
        onOpenChange={(open) => !open && setToCancel(null)}
        onCancelled={() => setToCancel(null)}
      />
    </div>
  );
}
