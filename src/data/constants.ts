import type { Reason, RequestStatus } from "@/types";

export const REASONS: Reason[] = ["Mudanza", "Movilidad", "Estudios", "Otro"];

export const STATUSES: RequestStatus[] = [
  "Activa",
  "Aprobado",
  "En curso",
  "Finalizada",
  "No aprobado",
  "Cancelada",
];

export const STATUS_STYLES: Record<RequestStatus, string> = {
  Activa: "bg-sky-100 text-sky-700 border-sky-200",
  Aprobado: "bg-violet-100 text-violet-700 border-violet-200",
  "En curso": "bg-amber-100 text-amber-700 border-amber-200",
  Finalizada: "bg-emerald-100 text-emerald-700 border-emerald-200",
  "No aprobado": "bg-red-100 text-red-700 border-red-200",
  Cancelada: "bg-stone-100 text-stone-600 border-stone-200",
};

export const STATUS_DOT_COLORS: Record<RequestStatus, string> = {
  Activa: "bg-sky-500",
  Aprobado: "bg-violet-500",
  "En curso": "bg-amber-500",
  Finalizada: "bg-emerald-500",
  "No aprobado": "bg-red-500",
  Cancelada: "bg-stone-400",
};
