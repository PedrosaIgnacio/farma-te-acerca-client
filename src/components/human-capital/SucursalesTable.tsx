import * as React from "react";
import { Building2, MoreVertical, Search } from "lucide-react";

import { SucursalDialog } from "@/components/human-capital/SucursalDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useHcBranches } from "@/hooks/useHcBranches";
import { ApiError, apiJson } from "@/lib/api";
import type { Branch } from "@/types";

interface SucursalesTableProps {
  // The "Nueva sucursal" trigger lives in the page's AccessCard, above this
  // table — these props let the page open the same create dialog this
  // table already renders (and owns the data hook for), instead of each
  // owning a separate copy of the dialog/mutation logic.
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
}

export function SucursalesTable({ createOpen, onCreateOpenChange }: SucursalesTableProps) {
  const { branches, loading, error, addBranch, updateBranch } = useHcBranches();
  const [query, setQuery] = React.useState("");
  const [editTarget, setEditTarget] = React.useState<Branch | null>(null);
  const [toggleTarget, setToggleTarget] = React.useState<Branch | null>(null);
  const [toggling, setToggling] = React.useState(false);
  const [toggleError, setToggleError] = React.useState<string | null>(null);

  const dialogOpen = createOpen || !!editTarget;
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditTarget(null);
      onCreateOpenChange(false);
    }
  };

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return branches;
    return branches.filter(
      (b) => b.name.toLowerCase().includes(term) || b.provincia.toLowerCase().includes(term),
    );
  }, [branches, query]);

  const openEdit = (b: Branch) => {
    setEditTarget(b);
  };

  const handleToggle = async () => {
    if (!toggleTarget) return;
    setToggling(true);
    setToggleError(null);
    try {
      const updated = await apiJson<Branch>(`/hc/branches/${toggleTarget.id}`, {
        method: "PATCH",
        body: JSON.stringify({ activa: !toggleTarget.activa }),
      });
      updateBranch(updated);
      setToggleTarget(null);
    } catch (err) {
      setToggleError(err instanceof ApiError ? err.message : "No se pudo actualizar la sucursal.");
    } finally {
      setToggling(false);
    }
  };

  return (
    <>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Sucursales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por sucursal o provincia"
              className="rounded-2xl pl-9"
              disabled={loading || !!error || branches.length === 0}
            />
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3 font-medium">Sucursal</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Provincia</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Región</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">
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
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="px-4 py-4">
                        <Skeleton className="h-5 w-16 rounded-full" />
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
            <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          ) : branches.length === 0 ? (
            <EmptyState icon={Building2} title="No hay sucursales" description="Cargá la primera sucursal para empezar." />
          ) : filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">
              No se encontraron sucursales que coincidan con "{query}".
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3 font-medium">Sucursal</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Provincia</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Región</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                      <td className="max-w-[10rem] truncate px-4 py-4 font-medium text-stone-800">{b.name}</td>
                      <td className="hidden max-w-[10rem] truncate px-4 py-4 text-stone-600 sm:table-cell">
                        {b.provincia}
                      </td>
                      <td className="hidden max-w-[10rem] truncate px-4 py-4 text-stone-600 sm:table-cell">
                        {b.region}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={
                            b.activa
                              ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                              : "border-stone-200 bg-stone-100 text-stone-600"
                          }
                        >
                          {b.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Acciones</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEdit(b)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setToggleTarget(b)}>
                              {b.activa ? "Desactivar" : "Activar"}
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

      <SucursalDialog
        open={dialogOpen}
        sucursal={editTarget}
        onOpenChange={handleDialogOpenChange}
        onCreated={addBranch}
        onUpdated={updateBranch}
      />

      <Dialog open={!!toggleTarget} onOpenChange={(v) => !v && setToggleTarget(null)}>
        <DialogContent>
          {toggleTarget && (
            <>
              <DialogHeader>
                <DialogTitle>{toggleTarget.activa ? "Desactivar sucursal" : "Activar sucursal"}</DialogTitle>
                <DialogDescription>
                  {toggleTarget.activa
                    ? `"${toggleTarget.name}" va a dejar de estar disponible para nuevas solicitudes y colaboradores.`
                    : `"${toggleTarget.name}" va a volver a estar disponible para nuevas solicitudes y colaboradores.`}
                </DialogDescription>
              </DialogHeader>
              {toggleError && <p className="text-sm text-red-600">{toggleError}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setToggleTarget(null)} disabled={toggling}>
                  Volver
                </Button>
                <Button className="bg-[#1F7A4D] hover:bg-[#19653F]" onClick={handleToggle} disabled={toggling}>
                  {toggling ? "Guardando..." : toggleTarget.activa ? "Sí, desactivar" : "Sí, activar"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
