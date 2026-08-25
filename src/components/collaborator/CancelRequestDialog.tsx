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
import { useRequests } from "@/context/RequestsContext";
import { ApiError } from "@/lib/api";
import type { RequestHistoryEntry } from "@/types";

interface CancelRequestDialogProps {
  request: Pick<RequestHistoryEntry, "id" | "branch"> | null;
  onOpenChange: (open: boolean) => void;
  onCancelled: (id: number) => void;
}

export function CancelRequestDialog({ request, onOpenChange, onCancelled }: CancelRequestDialogProps) {
  const { cancelRequest } = useRequests();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setError(null);
  }, [request]);

  const handleConfirm = async () => {
    if (!request) return;
    setSubmitting(true);
    setError(null);
    try {
      await cancelRequest(request.id);
      onCancelled(request.id);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo cancelar la solicitud.");
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
              <DialogTitle>Cancelar solicitud</DialogTitle>
              <DialogDescription>
                Se eliminará definitivamente la solicitud N° {request.id} a {request.branch}. Esta
                acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
                Volver
              </Button>
              <Button variant="destructive" onClick={handleConfirm} disabled={submitting}>
                {submitting ? "Cancelando..." : "Sí, cancelar solicitud"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
