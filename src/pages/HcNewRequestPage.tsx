import * as React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { CollaboratorSelect } from "@/components/human-capital/CollaboratorSelect";
import { RelocationRequestForm } from "@/components/shared/RelocationRequestForm";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useHcCollaborators } from "@/hooks/useHcCollaborators";
import { apiJson } from "@/lib/api";
import type { NewRequestInput, RequestHistoryEntry } from "@/types";

export function HcNewRequestPage() {
  const navigate = useNavigate();
  const { collaborators, loading: collaboratorsLoading } = useHcCollaborators();
  const [colabId, setColabId] = React.useState("");

  const selected = collaborators.find((c) => c.id === colabId) ?? null;

  const handleSubmit = async (input: NewRequestInput) => {
    const newEntry = await apiJson<RequestHistoryEntry>("/hc/requests", {
      method: "POST",
      body: JSON.stringify({ ...input, colabId }),
    });
    navigate("/capital-humano/solicitudes", { state: { confirmation: newEntry } });
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-12">
        <div className="col-span-12 space-y-6 lg:col-span-8 lg:col-start-3">
          <div className="flex items-start gap-3">
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() => navigate("/capital-humano/solicitudes")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-stone-800">Nueva solicitud de relocalización</h1>
              <p className="text-sm text-stone-500">
                Cargá una solicitud de relocalización en nombre de un colaborador.
              </p>
            </div>
          </div>

          <RelocationRequestForm
            currentBranchId={selected?.currentBranchId ?? null}
            currentBranch={selected?.currentBranch ?? null}
            currentBranchPlaceholder={colabId ? "Sin sucursal asignada" : "Seleccioná un colaborador"}
            submitDisabled={!colabId}
            onSubmit={handleSubmit}
            extraFields={
              <div className="space-y-1.5">
                <Label>Colaborador</Label>
                <CollaboratorSelect
                  value={colabId}
                  onChange={setColabId}
                  collaborators={collaborators}
                  loading={collaboratorsLoading}
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
