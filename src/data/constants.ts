import type { EstadoCodigo, Reason } from "@/types";

export const REASONS: Reason[] = ["Mudanza", "Movilidad", "Estudios", "Otro"];

// Keyed by EstadoCodigo (the stable business key), not by the display
// `nombre` — renaming an estado in the DB must never break these lookups,
// which is exactly what happened when they used to be keyed by name. See
// the API's status.util.ts ESTADO_CODIGOS doc comment for the full story.
export const STATUS_STYLES: Record<EstadoCodigo, string> = {
  ACTIVA: "bg-sky-100 text-sky-700 border-sky-200",
  APROBADO: "bg-violet-100 text-violet-700 border-violet-200",
  EN_CURSO: "bg-amber-100 text-amber-700 border-amber-200",
  FINALIZADA: "bg-emerald-100 text-emerald-700 border-emerald-200",
  NO_APROBADO: "bg-red-100 text-red-700 border-red-200",
  CANCELADA: "bg-stone-100 text-stone-600 border-stone-200",
};

export const STATUS_DOT_COLORS: Record<EstadoCodigo, string> = {
  ACTIVA: "bg-sky-500",
  APROBADO: "bg-violet-500",
  EN_CURSO: "bg-amber-500",
  FINALIZADA: "bg-emerald-500",
  NO_APROBADO: "bg-red-500",
  CANCELADA: "bg-stone-400",
};

// Mirrors the API's OPEN_CODIGOS (src/common/status.util.ts in
// farma-te-acerca-api) — a collaborator can only self-cancel (hard-delete)
// a request that's still open; once HC has closed it out (Finalizada/No
// aprobado) that outcome isn't the collaborator's to erase, and DELETE
// /requests/:id 409s. Checked here too so the cancel action doesn't even
// show for a request already in a terminal estado.
export const CANCELABLE_STATUSES: EstadoCodigo[] = ["ACTIVA", "APROBADO", "EN_CURSO"];

// Mirrors the API's ALLOWED_TRANSITIONS (src/common/status.util.ts in
// farma-te-acerca-api) — the state machine approved by the thesis director
// for HC's status-change dialog. 'FINALIZADA', 'CANCELADA' and
// 'NO_APROBADO' are all terminal (no outgoing edges). This is the
// frontend-side guard only (so the dialog never even offers an illegal
// move) — the API enforces the same map server-side regardless of what's
// sent, so this must be kept in sync with it, not treated as the source of
// truth.
export const ALLOWED_STATUS_TRANSITIONS: Record<EstadoCodigo, EstadoCodigo[]> = {
  ACTIVA: ["EN_CURSO"],
  APROBADO: ["NO_APROBADO", "FINALIZADA", "CANCELADA"],
  EN_CURSO: ["APROBADO", "NO_APROBADO", "FINALIZADA", "CANCELADA"],
  FINALIZADA: [],
  NO_APROBADO: [],
  CANCELADA: [],
};
