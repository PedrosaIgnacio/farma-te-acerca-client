import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ALLOWED_STATUS_TRANSITIONS } from "@/data/constants";
import { useActiveStatuses } from "@/hooks/useActiveStatuses";
import { ApiError, apiJson } from "@/lib/api";
import type { Estado, EstadoCodigo, HCRequest } from "@/types";

interface RequestStatusDialogProps {
  request: HCRequest | null;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updated: HCRequest) => void;
}

export function RequestStatusDialog({ request, onOpenChange, onUpdated }: RequestStatusDialogProps) {
  const [newStatus, setNewStatus] = React.useState<EstadoCodigo | null>(null);
  const [motivo, setMotivo] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { statuses: activeStatuses, loading: loadingStatuses } = useActiveStatuses();

  // Only estados reachable from the request's current one per the approved
  // state machine (ALLOWED_STATUS_TRANSITIONS), keyed and compared by
  // `statusCode`/`codigo` (the stable business key) rather than the
  // renamable display name — further narrowed to estados still active in
  // the DB (useActiveStatuses/GET /estados) so a soft-deleted estado stops
  // being offered as a target even though it's still in the static
  // transition map. Never includes the current status itself, forcing an
  // explicit choice rather than defaulting to a no-op.
  const activeByCodigo = new Map(activeStatuses.map((e) => [e.codigo, e]));
  const allowedNext: Estado[] = request
    ? ALLOWED_STATUS_TRANSITIONS[request.statusCode]
        .map((codigo) => activeByCodigo.get(codigo))
        .filter((e): e is Estado => e !== undefined)
    : [];
  const isTerminal = !loadingStatuses && allowedNext.length === 0;

  React.useEffect(() => {
    setNewStatus(null);
    setMotivo("");
    setError(null);
  }, [request]);

  const handleSubmit = async () => {
    if (!request || !newStatus || !motivo.trim() || !allowedNext.some((e) => e.codigo === newStatus)) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await apiJson<HCRequest>(`/hc/requests/${request.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ codigo: newStatus, motivo: motivo.trim() }),
      });
      onUpdated(updated);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo actualizar el estado.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!request} onOpenChange={onOpenChange}>
      <DialogContent>
        {request && (
          <>
            <DialogHeader>
              <DialogTitle>Cambiar estado</DialogTitle>
              <DialogDescription>
                {request.collaborator} — solicitud a {request.desiredBranch}
              </DialogDescription>
            </DialogHeader>

            {isTerminal ? (
              <p className="text-sm text-stone-600">
                Esta solicitud está en estado "{request.status}", un estado final que no admite
                más cambios.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Nuevo estado</Label>
                  <Select
                    value={newStatus ?? undefined}
                    onValueChange={(v) => setNewStatus(v as EstadoCodigo)}
                    disabled={loadingStatuses}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={loadingStatuses ? "Cargando estados..." : "Seleccioná un estado"} />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedNext.map((estado) => (
                        <SelectItem key={estado.codigo} value={estado.codigo}>
                          {estado.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Motivo</Label>
                  <Textarea
                    maxLength={240}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Explicá el motivo del cambio de estado..."
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {isTerminal ? "Cerrar" : "Cancelar"}
              </Button>
              {!isTerminal && (
                <Button
                  className="bg-[#1F7A4D] hover:bg-[#19653F]"
                  onClick={handleSubmit}
                  disabled={
                    submitting || !motivo.trim() || !newStatus || !allowedNext.some((e) => e.codigo === newStatus)
                  }
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
