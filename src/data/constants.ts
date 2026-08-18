import type { Reason, RequestStatus } from "@/types";

export const REASONS: Reason[] = ["Mudanza", "Movilidad", "Estudios", "Otro"];

export const STATUSES: RequestStatus[] = ["Activa", "En curso", "Cancelada", "Finalizada"];

export const STATUS_STYLES: Record<RequestStatus, string> = {
  Activa: "bg-sky-100 text-sky-700 border-sky-200",
  "En curso": "bg-amber-100 text-amber-700 border-amber-200",
  Cancelada: "bg-stone-100 text-stone-600 border-stone-200",
  Finalizada: "bg-emerald-100 text-emerald-700 border-emerald-200",
};
