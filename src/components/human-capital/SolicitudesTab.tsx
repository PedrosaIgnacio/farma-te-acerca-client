import * as React from "react";
import { ClipboardList, MoreVertical, Search } from "lucide-react";

import { RequestDetailSheet } from "@/components/human-capital/RequestDetailSheet";
import { RequestStatusDialog } from "@/components/human-capital/RequestStatusDialog";
import { BranchSelect } from "@/components/shared/BranchSelect";
import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHcRequests } from "@/hooks/useHcRequests";
import type { HCRequest } from "@/types";

export function SolicitudesTab() {
  const { branchId, setBranchId, show, requests, loading, error, search, updateRequest } =
    useHcRequests();
  const [selected, setSelected] = React.useState<HCRequest | null>(null);
  const [statusTarget, setStatusTarget] = React.useState<HCRequest | null>(null);

  const handleUpdated = (updated: HCRequest) => {
    updateRequest(updated);
    setSelected((prev) => (prev?.id === updated.id ? updated : prev));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <BranchSelect value={branchId} onChange={setBranchId} />
        </div>
        <Button
          onClick={search}
          disabled={!branchId || loading}
          className="gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
        >
          <Search className="h-4 w-4" /> Mostrar solicitudes
        </Button>
      </div>

      {show && loading && (
        <p className="py-6 text-center text-sm text-stone-400">Cargando solicitudes...</p>
      )}

      {show && !loading && error && (
        <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {show && !loading && !error && requests.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No hay solicitudes para esta sucursal"
          description="No se encontraron solicitudes de relocalización activas hacia la sucursal seleccionada."
        />
      )}

      {show && !loading && !error && requests.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                  <th className="px-4 py-3 font-medium">Colaborador</th>
                  <th className="px-4 py-3 font-medium">Sucursal actual</th>
                  <th className="px-4 py-3 font-medium">Motivo</th>
                  <th className="px-4 py-3 font-medium">Fecha</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="cursor-pointer border-b border-stone-50 last:border-0 hover:bg-stone-50"
                  >
                    <td className="px-4 py-3 font-medium text-stone-800">{r.collaborator}</td>
                    <td className="px-4 py-3 text-stone-600">{r.currentBranch}</td>
                    <td className="px-4 py-3 text-stone-600">{r.reason}</td>
                    <td className="px-4 py-3 text-stone-600">{r.date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
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
          </CardContent>
        </Card>
      )}

      <RequestDetailSheet request={selected} onOpenChange={(v) => !v && setSelected(null)} />
      <RequestStatusDialog
        request={statusTarget}
        onOpenChange={(v) => !v && setStatusTarget(null)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
