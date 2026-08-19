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
import { STATUSES } from "@/data/constants";
import { ApiError, apiJson } from "@/lib/api";
import type { HCRequest, RequestStatus } from "@/types";

interface RequestStatusDialogProps {
  request: HCRequest | null;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updated: HCRequest) => void;
}

export function RequestStatusDialog({ request, onOpenChange, onUpdated }: RequestStatusDialogProps) {
  const [newStatus, setNewStatus] = React.useState<RequestStatus | null>(null);
  const [motivo, setMotivo] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setNewStatus(request?.status ?? null);
    setMotivo("");
    setError(null);
  }, [request]);

  const handleSubmit = async () => {
    if (!request || !newStatus || !motivo.trim() || newStatus === request.status) return;
    setSubmitting(true);
    setError(null);
    try {
      const updated = await apiJson<HCRequest>(`/hc/requests/${request.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus, motivo: motivo.trim() }),
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

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Nuevo estado</Label>
                <Select value={newStatus ?? undefined} onValueChange={(v) => setNewStatus(v as RequestStatus)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
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

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                className="bg-[#1F7A4D] hover:bg-[#19653F]"
                onClick={handleSubmit}
                disabled={
                  submitting || !motivo.trim() || !newStatus || newStatus === request.status
                }
              >
                {submitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
