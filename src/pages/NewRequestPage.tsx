import * as React from "react";
import { AlertTriangle, ClipboardList, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { BranchSelect } from "@/components/shared/BranchSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRequests } from "@/context/RequestsContext";
import { REASONS } from "@/data/constants";
import { ApiError } from "@/lib/api";
import type { Reason } from "@/types";

export function NewRequestPage() {
  const navigate = useNavigate();
  const { addRequest, currentBranchId, currentBranch, currentBranchLoading } = useRequests();

  const [desiredBranch, setDesiredBranch] = React.useState("");
  const [reason, setReason] = React.useState<Reason | "">("");
  const [otherReason, setOtherReason] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [conflict, setConflict] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBranchId || !desiredBranch || !reason) return;

    setConflict(null);
    setError(null);
    setSubmitting(true);
    try {
      const newEntry = await addRequest({
        currentBranchId,
        desiredBranchId: Number(desiredBranch),
        reason,
        otherReason: reason === "Otro" ? otherReason : undefined,
        description: description || undefined,
      });
      navigate("/colaborador", { state: { confirmation: newEntry } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setConflict(err.message);
      } else {
        setError(err instanceof ApiError ? err.message : "No se pudo cargar la solicitud.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Nueva solicitud de relocalización</h1>
        <p className="text-sm text-stone-500">
          Cargá la sucursal a la que te gustaría trasladarte. El área de Capital Humano se pondrá
          en contacto ante disponibilidad.
        </p>
      </div>

      {conflict && (
        <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <ClipboardList className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{conflict}</div>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nueva solicitud</CardTitle>
          <CardDescription>Todos los campos son obligatorios salvo la descripción.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Sucursal actual</Label>
                <Select value={currentBranchId != null ? String(currentBranchId) : ""} disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={currentBranchLoading ? "Cargando..." : "Sin sucursal asignada"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {currentBranchId != null && currentBranch && (
                      <SelectItem value={String(currentBranchId)}>{currentBranch}</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Sucursal deseada</Label>
                <BranchSelect value={desiredBranch} onChange={setDesiredBranch} placeholder="Elegí destino" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Motivo</Label>
              <Select value={reason} onValueChange={(v) => setReason(v as Reason)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná un motivo" />
                </SelectTrigger>
                <SelectContent>
                  {REASONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {reason === "Otro" && (
              <div className="space-y-1.5">
                <Label>Especificá el motivo</Label>
                <Input value={otherReason} onChange={(e) => setOtherReason(e.target.value)} />
              </div>
            )}

            <div className="space-y-1.5">
              <Label>Descripción adicional (opcional)</Label>
              <Textarea
                maxLength={240}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contanos algo más sobre tu solicitud..."
              />
              <p className="text-right text-xs text-stone-400">{description.length}/240</p>
            </div>

            <Button
              type="submit"
              disabled={submitting || currentBranchLoading || currentBranchId == null}
              className="gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
            >
              <Send className="h-4 w-4" /> {submitting ? "Enviando..." : "Cargar solicitud"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
