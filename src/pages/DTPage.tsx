import * as React from "react";
import { ChevronRight, Mail, MapPin, Search, Users } from "lucide-react";

import { BranchSelect } from "@/components/shared/BranchSelect";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBranches } from "@/hooks/useBranches";
import { ApiError, apiJson } from "@/lib/api";
import type { NearbyEmployee } from "@/types";

const EARTH_RADIUS_KM = 6371;

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

// Google's directions embed auto-fits both markers with generous padding by
// default (very zoomed out). Picking a zoom level from the actual distance
// between the two points keeps it tight regardless of how close or far
// apart they are — branches range from a few blocks to other provinces/countries.
function zoomForDistanceKm(km: number) {
  if (km < 1) return 15;
  if (km < 2) return 14;
  if (km < 5) return 13;
  if (km < 10) return 12;
  if (km < 20) return 11;
  if (km < 50) return 10;
  return 8;
}

export function DTPage() {
  const [branchId, setBranchId] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [employees, setEmployees] = React.useState<NearbyEmployee[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<NearbyEmployee | null>(null);
  const { branches } = useBranches();
  const selectedBranch = branches.find((b) => b.id === Number(branchId));

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
    <div className="space-y-6 p-6">
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Card key={i}>
              <CardContent className="pt-5">
                <Skeleton className="mb-3 h-10 w-10 rounded-full" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="mt-1.5 h-3 w-24" />
                <div className="mt-3 flex items-center justify-between">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
        <DialogContent className="sm:max-w-lg">
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
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Email</span>
                  <span className="font-medium text-stone-800">{selected.email}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-stone-500">Teléfono</span>
                  <span className="font-medium text-stone-800">
                    {selected.phone ?? "Sin teléfono cargado"}
                  </span>
                </div>
              </div>
              {selectedBranch?.lat != null && selectedBranch?.lng != null ? (
                <div className="overflow-hidden rounded-md border border-stone-200">
                  <iframe
                    title={`Domicilio de ${selected.name} y ubicación de ${selectedBranch.name}`}
                    className="h-80 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?saddr=${selected.lat},${selected.lng}&daddr=${selectedBranch.lat},${selectedBranch.lng}&output=embed&z=${zoomForDistanceKm(
                      haversineKm(selected, { lat: selectedBranch.lat, lng: selectedBranch.lng }),
                    )}`}
                  />
                </div>
              ) : (
                <p className="rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-500">
                  Sin coordenadas cargadas para esta sucursal.
                </p>
              )}
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
