import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHcProvincias } from "@/hooks/useHcProvincias";
import { ApiError, apiJson } from "@/lib/api";
import type { Branch } from "@/types";

interface SucursalDialogProps {
  open: boolean;
  sucursal: Branch | null; // null = create
  onOpenChange: (open: boolean) => void;
  onCreated: (created: Branch) => void;
  onUpdated: (updated: Branch) => void;
}

export function SucursalDialog({ open, sucursal, onOpenChange, onCreated, onUpdated }: SucursalDialogProps) {
  const { provincias } = useHcProvincias();
  const [nombre, setNombre] = React.useState("");
  const [provinciaId, setProvinciaId] = React.useState<string | null>(null);
  const [lat, setLat] = React.useState("");
  const [lng, setLng] = React.useState("");
  const [activa, setActiva] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setNombre(sucursal?.name ?? "");
    setProvinciaId(sucursal ? String(sucursal.provinciaId) : null);
    setLat(sucursal?.lat != null ? String(sucursal.lat) : "");
    setLng(sucursal?.lng != null ? String(sucursal.lng) : "");
    setActiva(sucursal?.activa ?? true);
    setError(null);
  }, [sucursal, open]);

  const handleSubmit = async () => {
    if (!nombre.trim() || !provinciaId) return;
    setSubmitting(true);
    setError(null);
    try {
      const body = {
        nombre: nombre.trim(),
        provinciaId: Number(provinciaId),
        lat: lat.trim() ? Number(lat) : undefined,
        lng: lng.trim() ? Number(lng) : undefined,
        ...(sucursal ? { activa } : {}),
      };
      if (sucursal) {
        const updated = await apiJson<Branch>(`/hc/branches/${sucursal.id}`, {
          method: "PATCH",
          body: JSON.stringify(body),
        });
        onUpdated(updated);
      } else {
        const created = await apiJson<Branch>("/hc/branches", {
          method: "POST",
          body: JSON.stringify(body),
        });
        onCreated(created);
      }
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar la sucursal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{sucursal ? "Editar sucursal" : "Nueva sucursal"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Farmacity Palermo" />
          </div>

          <div className="space-y-1.5">
            <Label>Provincia</Label>
            <Select value={provinciaId ?? undefined} onValueChange={setProvinciaId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccioná una provincia" />
              </SelectTrigger>
              <SelectContent>
                {provincias.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.nombre} ({p.region.nombre})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Latitud</Label>
              <Input type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Opcional" />
            </div>
            <div className="space-y-1.5">
              <Label>Longitud</Label>
              <Input type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Opcional" />
            </div>
          </div>
          <p className="text-xs text-stone-500">
            Latitud y longitud son necesarias para que la sucursal aparezca en "colaboradores cercanos" de DT.
          </p>

          {sucursal && (
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={activa ? "activa" : "inactiva"} onValueChange={(v) => setActiva(v === "activa")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-[#1F7A4D] hover:bg-[#19653F]"
            onClick={handleSubmit}
            disabled={submitting || !nombre.trim() || !provinciaId}
          >
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
