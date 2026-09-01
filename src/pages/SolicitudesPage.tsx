import { Plus, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { SolicitudesTab } from "@/components/human-capital/SolicitudesTab";
import { AccessCard } from "@/components/shared/AccessCard";
import type { RequestHistoryEntry } from "@/types";

export function SolicitudesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const confirmation =
    (location.state as { confirmation?: RequestHistoryEntry } | null)?.confirmation ?? null;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Solicitudes</h1>
        <p className="text-sm text-stone-500">
          Consultá las solicitudes de relocalización de todas las sucursales.
        </p>
      </div>

      <AccessCard
        icon={Plus}
        title="Nueva solicitud"
        description="Cargá una solicitud de relocalización para un colaborador."
        onClick={() => navigate("/capital-humano/solicitudes/nueva")}
      />

      {confirmation && (
        <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            Solicitud exitosa — N° <strong>{confirmation.id}</strong>, estado:{" "}
            <strong>{confirmation.status}</strong>.
          </div>
        </div>
      )}

      <SolicitudesTab />
    </div>
  );
}
