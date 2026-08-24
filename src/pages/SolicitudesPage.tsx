import { ChevronRight, Plus, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { SolicitudesTab } from "@/components/human-capital/SolicitudesTab";
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

      <button
        type="button"
        onClick={() => navigate("/capital-humano/solicitudes/nueva")}
        className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-5 text-left shadow-sm transition hover:border-[#1F7A4D]/40 hover:shadow-md"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1F7A4D]/10 text-[#1F7A4D]">
          <Plus className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-base font-bold text-stone-800">Nueva solicitud</p>
          <p className="text-xs text-stone-500">Cargá una solicitud de relocalización para un colaborador.</p>
        </div>
        <ChevronRight className="h-4 w-4 shrink-0 text-stone-300" />
      </button>

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
