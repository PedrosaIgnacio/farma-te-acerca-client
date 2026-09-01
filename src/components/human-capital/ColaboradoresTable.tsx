import * as React from "react";
import { MoreVertical, Search, UserCog } from "lucide-react";

import { ColaboradorDialog } from "@/components/human-capital/ColaboradorDialog";
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
import { ROLE_LABEL } from "@/config/navigation";
import { useHcUsers } from "@/hooks/useHcUsers";
import { ApiError, apiJson } from "@/lib/api";
import type { HcUser } from "@/types";

interface ColaboradoresTableProps {
  // The "Nuevo colaborador" trigger lives in the page's AccessCard, above
  // this table — these props let the page open the same create dialog this
  // table already renders (and owns the data hook for), instead of each
  // owning a separate copy of the dialog/mutation logic.
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
}

export function ColaboradoresTable({ createOpen, onCreateOpenChange }: ColaboradoresTableProps) {
  const { users, loading, error, addUser, updateUser } = useHcUsers();
  const [query, setQuery] = React.useState("");
  const [editTarget, setEditTarget] = React.useState<HcUser | null>(null);
  const [toggleTarget, setToggleTarget] = React.useState<HcUser | null>(null);
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
    if (!term) return users;
    return users.filter(
      (u) =>
        u.nombre.toLowerCase().includes(term) ||
        u.legajo.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term),
    );
  }, [users, query]);

  const openEdit = (u: HcUser) => {
    setEditTarget(u);
  };

  const handleToggle = async () => {
    if (!toggleTarget) return;
    setToggling(true);
    setToggleError(null);
    try {
      const updated = await apiJson<HcUser>(`/hc/users/${toggleTarget.id}`, {
        method: "PATCH",
        body: JSON.stringify({ activo: !toggleTarget.activo }),
      });
      updateUser(updated);
      setToggleTarget(null);
    } catch (err) {
      setToggleError(err instanceof ApiError ? err.message : "No se pudo actualizar el colaborador.");
    } finally {
      setToggling(false);
    }
  };

  return (
    <>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Colaboradores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative w-full sm:w-1/2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por legajo, nombre o email"
              className="rounded-2xl pl-9"
              disabled={loading || !!error || users.length === 0}
            />
          </div>

          {loading ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3 font-medium">Colaborador</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Email</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Rol</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Sucursal</th>
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
                        <Skeleton className="h-4 w-32" />
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      <td className="hidden px-4 py-4 sm:table-cell">
                        <Skeleton className="h-4 w-24" />
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
          ) : users.length === 0 ? (
            <EmptyState icon={UserCog} title="No hay colaboradores" description="Cargá el primer colaborador para empezar." />
          ) : filtered.length === 0 ? (
            <p className="py-6 text-center text-sm text-stone-400">
              No se encontraron colaboradores que coincidan con "{query}".
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                    <th className="px-4 py-3 font-medium">Colaborador</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Email</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Rol</th>
                    <th className="hidden px-4 py-3 font-medium sm:table-cell">Sucursal</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-stone-50 last:border-0 hover:bg-stone-50">
                      <td className="max-w-[10rem] truncate px-4 py-4 font-medium text-stone-800">
                        {u.nombre}
                        <span className="block text-xs font-normal text-stone-400">Legajo {u.legajo}</span>
                      </td>
                      <td className="hidden max-w-[12rem] truncate px-4 py-4 text-stone-600 sm:table-cell">
                        {u.email}
                      </td>
                      <td className="hidden px-4 py-4 text-stone-600 sm:table-cell">{ROLE_LABEL[u.rol]}</td>
                      <td className="hidden max-w-[10rem] truncate px-4 py-4 text-stone-600 sm:table-cell">
                        {u.currentBranch ?? "—"}
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={
                            u.activo
                              ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                              : "border-stone-200 bg-stone-100 text-stone-600"
                          }
                        >
                          {u.activo ? "Activo" : "Inactivo"}
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
                            <DropdownMenuItem onClick={() => openEdit(u)}>Editar</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setToggleTarget(u)}>
                              {u.activo ? "Desactivar" : "Activar"}
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

      <ColaboradorDialog
        open={dialogOpen}
        user={editTarget}
        onOpenChange={handleDialogOpenChange}
        onCreated={addUser}
        onUpdated={updateUser}
      />

      <Dialog open={!!toggleTarget} onOpenChange={(v) => !v && setToggleTarget(null)}>
        <DialogContent>
          {toggleTarget && (
            <>
              <DialogHeader>
                <DialogTitle>{toggleTarget.activo ? "Desactivar colaborador" : "Activar colaborador"}</DialogTitle>
                <DialogDescription>
                  {toggleTarget.activo
                    ? `"${toggleTarget.nombre}" no va a poder iniciar sesión hasta que se reactive.`
                    : `"${toggleTarget.nombre}" va a poder volver a iniciar sesión.`}
                </DialogDescription>
              </DialogHeader>
              {toggleError && <p className="text-sm text-red-600">{toggleError}</p>}
              <DialogFooter>
                <Button variant="outline" onClick={() => setToggleTarget(null)} disabled={toggling}>
                  Volver
                </Button>
                <Button className="bg-[#1F7A4D] hover:bg-[#19653F]" onClick={handleToggle} disabled={toggling}>
                  {toggling ? "Guardando..." : toggleTarget.activo ? "Sí, desactivar" : "Sí, activar"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
