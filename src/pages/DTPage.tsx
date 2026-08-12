import * as React from "react";
import { ChevronRight, Mail, MapPin, Search, Users } from "lucide-react";

import { BranchSelect } from "@/components/shared/BranchSelect";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiError, apiJson } from "@/lib/api";
import type { NearbyEmployee } from "@/types";

export function DTPage() {
  const [branchId, setBranchId] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [employees, setEmployees] = React.useState<NearbyEmployee[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<NearbyEmployee | null>(null);

  const handleShow = async () => {
    if (!branchId) return;
    setShow(true);
    setLoading(true);
    setError(null);
    try {
      const data = await apiJson<NearbyEmployee[]>(`/dt/nearby-employees?branchId=${branchId}`);
      setEmployees(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "No se pudieron cargar los colaboradores cercanos.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Colaboradores cercanos</h1>
        <p className="text-sm text-stone-500">
          Consultá colaboradores disponibles cerca de tu sucursal ante una contingencia.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <BranchSelect value={branchId} onChange={setBranchId} />
        </div>
        <Button
          onClick={handleShow}
          disabled={!branchId || loading}
          className="gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
        >
          <Search className="h-4 w-4" /> Mostrar colaboradores cercanos
        </Button>
      </div>

      {show && loading && (
        <p className="py-6 text-center text-sm text-stone-400">Buscando colaboradores cercanos...</p>
      )}

      {show && !loading && error && (
        <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {show && !loading && !error && employees.length === 0 && (
        <EmptyState
          icon={Users}
          title="No hay colaboradores cercanos"
          description="No se encontraron colaboradores disponibles cerca de la sucursal seleccionada."
        />
      )}

      {show && !loading && !error && employees.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {employees.map((e) => (
            <Card
              key={e.id}
              className="cursor-pointer transition hover:border-[#1F7A4D]/40 hover:shadow-sm"
              onClick={() => setSelected(e)}
            >
              <CardContent className="pt-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A4D]/10 text-[#1F7A4D]">
                  <Users className="h-5 w-5" />
                </div>
                <p className="font-medium text-stone-800">{e.name}</p>
                <p className="text-xs text-stone-500">{e.currentBranch}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline" className="gap-1 border-stone-200 text-stone-600">
                    <MapPin className="h-3 w-3" /> {e.distance}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-stone-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-sm">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>Legajo {selected.employeeId}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Sucursal actual</span>
                  <span className="font-medium text-stone-800">{selected.currentBranch}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Distancia</span>
                  <span className="font-medium text-stone-800">{selected.distance}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-stone-500">Email</span>
                  <span className="font-medium text-stone-800">{selected.email}</span>
                </div>
              </div>
              <DialogFooter>
                <Button
                  className="w-full gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
                  onClick={() => {
                    window.location.href = `mailto:${selected.email}`;
                  }}
                >
                  <Mail className="h-4 w-4" /> Solicitar cobertura
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
