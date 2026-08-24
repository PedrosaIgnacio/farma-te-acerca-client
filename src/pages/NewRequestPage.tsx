import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { RelocationRequestForm } from "@/components/shared/RelocationRequestForm";
import { Button } from "@/components/ui/button";
import { useRequests } from "@/context/RequestsContext";
import type { NewRequestInput } from "@/types";

export function NewRequestPage() {
  const navigate = useNavigate();
  const { addRequest, currentBranchId, currentBranch, currentBranchLoading } = useRequests();

  const handleSubmit = async (input: NewRequestInput) => {
    const newEntry = await addRequest(input);
    navigate("/colaborador", { state: { confirmation: newEntry } });
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
              onClick={() => navigate("/colaborador")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-stone-800">Nueva solicitud de relocalización</h1>
              <p className="text-sm text-stone-500">Cargá la sucursal a la que te gustaría relocalizarte.</p>
            </div>
          </div>

          <RelocationRequestForm
            currentBranchId={currentBranchId}
            currentBranch={currentBranch}
            currentBranchLoading={currentBranchLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
