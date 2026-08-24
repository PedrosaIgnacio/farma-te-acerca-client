import * as React from "react";
import { ClipboardList, Filter, MoreVertical, Search } from "lucide-react";

import { RequestDetailSheet } from "@/components/human-capital/RequestDetailSheet";
import { RequestStatusDialog } from "@/components/human-capital/RequestStatusDialog";
import { SolicitudesFilterDrawer } from "@/components/human-capital/SolicitudesFilterDrawer";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHcRequests } from "@/hooks/useHcRequests";
import type { HCRequest } from "@/types";

export function SolicitudesTab() {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [branchId, setBranchId] = React.useState<string | null>(null);
  const { requests, loading, error, updateRequest } = useHcRequests(branchId);
  const [selected, setSelected] = React.useState<HCRequest | null>(null);
  const [statusTarget, setStatusTarget] = React.useState<HCRequest | null>(null);
  const [query, setQuery] = React.useState("");
  const activeFilterCount = branchId ? 1 : 0;

  const filteredRequests = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return requests;
    return requests.filter(
      (r) =>
        r.collaborator.toLowerCase().includes(term) ||
        r.currentBranch.toLowerCase().includes(term) ||
        r.desiredBranch.toLowerCase().includes(term) ||
        r.reason.toLowerCase().includes(term) ||
        r.status.toLowerCase().includes(term),
    );
  }, [requests, query]);

  const handleUpdated = (updated: HCRequest) => {
    updateRequest(updated);
    setSelected((prev) => (prev?.id === updated.id ? updated : prev));
  };

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Solicitudes de relocalización</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-1/2">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por colaborador, motivo o estado"
                className="rounded-2xl pl-9"
                disabled={loading || !!error || requests.length === 0}
              />
            </div>
            <div className="relative inline-flex shrink-0">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setFilterOpen(true)}>
                <Filter className="h-4 w-4" /> Filtros
              </Button>
              {activeFilterCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#1F7A4D] p-0 text-[10px] text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3 font-medium">Colaborador</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Sucursal actual</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Sucursal deseada</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Motivo</th>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Estado</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 4 }, (_, i) => (
                    <tr key={i} className="border-b border-stone-50 last:border-0">
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-4 w-28" />
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-5 w-20 rounded-full" />
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-4 w-4" />
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
          ) : requests.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title={branchId ? "No hay solicitudes para esta sucursal" : "No hay solicitudes"}
              description={
                branchId
                  ? "No se encontraron solicitudes de relocalización hacia la sucursal seleccionada."
                  : "Todavía no se registraron solicitudes de relocalización."
              }
            />
          ) : filteredRequests.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">
              No se encontraron solicitudes que coincidan con "{query}".
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3 font-medium">Colaborador</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Sucursal actual</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Sucursal deseada</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Motivo</th>
                    <th className="px-4 py-3 font-medium">Fecha</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Estado</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((r) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r)}
                      className="cursor-pointer border-b border-stone-50 last:border-0 hover:bg-stone-50"
                    >
                      <td className="max-w-[8rem] truncate px-4 py-4 font-medium text-stone-800 sm:max-w-[12rem]">
                        {r.collaborator}
                      </td>
                      <td className="hidden max-w-[10rem] truncate px-4 py-4 text-stone-600 sm:table-cell">
                        {r.currentBranch}
                      </td>
                      <td className="hidden max-w-[10rem] truncate px-4 py-4 text-stone-600 sm:table-cell">
                        {r.desiredBranch}
                      </td>
                      <td className="hidden max-w-[10rem] truncate px-4 py-4 text-stone-600 sm:table-cell">
                        {r.reason}
                      </td>
                      <td className="whitespace-nowrap px-4 py-4 text-stone-600">{r.date}</td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="hidden px-4 py-4 text-right sm:table-cell">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                            <DropdownMenuItem onClick={() => setStatusTarget(r)}>
                              Cambiar estado
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <RequestDetailSheet
        request={selected}
        onOpenChange={(v) => !v && setSelected(null)}
        onChangeStatus={setStatusTarget}
      />
      <RequestStatusDialog
        request={statusTarget}
        onOpenChange={(v) => !v && setStatusTarget(null)}
        onUpdated={handleUpdated}
      />
      <SolicitudesFilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApply={setBranchId}
        onClear={() => setBranchId(null)}
      />
    </div>
  );
}
