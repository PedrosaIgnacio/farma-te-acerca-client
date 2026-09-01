export type Role = "collaborator" | "hc" | "dt";

export type Reason = "Mudanza" | "Movilidad" | "Estudios" | "Otro";

export type RequestStatus =
  | "Activa"
  | "Aprobado"
  | "En curso"
  | "Finalizada"
  | "No aprobado"
  | "Cancelada";

// Stable business key backing an estado (mirrors the API's EstadoCodigo in
// farma-te-acerca-api/src/common/status.util.ts) — everything that reasons
// about the estado (allowed transitions, badge/dot colors, whether a
// request is still cancelable) keys off this, never off `RequestStatus`
// (the renamable Spanish display label). Renaming an estado's `nombre` in
// the DB must never break that logic.
export type EstadoCodigo =
  | "ACTIVA"
  | "EN_CURSO"
  | "APROBADO"
  | "NO_APROBADO"
  | "FINALIZADA"
  | "CANCELADA";

export interface Session {
  user: string;
  role: Role;
  accessToken: string;
}

export interface CurrentUserResponse {
  id: string;
  legajo: string;
  fullName: string;
  role: Role;
  email: string;
  currentBranchId: number | null;
  currentBranch: string | null;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    legajo: string;
    fullName: string;
    role: Role;
    email: string;
  };
}

export interface NewRequestInput {
  currentBranchId: number;
  desiredBranchId: number;
  reason: Reason;
  otherReason?: string;
  description?: string;
}

export interface UpdateRequestStatusInput {
  codigo: EstadoCodigo;
  motivo: string;
}

export interface RequestConflictBody {
  message: string;
  existingRequestId: number;
  existingStatus: RequestStatus;
}

export interface AnalyticsFilters {
  region?: string;
  desiredBranchId?: number;
  estado?: RequestStatus;
  from?: string;
  to?: string;
}

export interface AnalyticsKpis {
  totalSolicitudes: number;
  activas: number;
  exitosas: number;
  successRate: string;
}

export interface AnalyticsResponse {
  kpis: AnalyticsKpis;
  regionData: RegionData[];
  statusData: StatusData[];
}

export interface Branch {
  id: number;
  name: string;
  region: string;
  provincia: string;
  lat: number | null;
  lng: number | null;
}

export interface RequestHistoryEntry {
  id: number;
  branch: string;
  date: string;
  status: RequestStatus;
  statusCode: EstadoCodigo;
}

export interface RequestStatusHistoryEntry {
  status: RequestStatus;
  statusCode: EstadoCodigo;
  startDate: string;
  endDate: string | null;
  motivo: string | null;
}

export interface RequestDetail {
  id: number;
  currentBranch: string;
  desiredBranch: string;
  reason: Reason;
  otherReason: string | null;
  description: string | null;
  date: string;
  status: RequestStatus;
  statusCode: EstadoCodigo;
  history: RequestStatusHistoryEntry[];
}

export interface HCRequest {
  id: number;
  collaborator: string;
  employeeId: string;
  currentBranch: string;
  desiredBranch: string;
  reason: Reason;
  date: string;
  status: RequestStatus;
  statusCode: EstadoCodigo;
  email: string;
}

export interface Estado {
  codigo: EstadoCodigo;
  nombre: RequestStatus;
  color: string;
}

export interface HcCollaborator {
  id: string;
  legajo: string;
  name: string;
  currentBranchId: number | null;
  currentBranch: string | null;
}

export interface NearbyEmployee {
  id: number;
  name: string;
  employeeId: string;
  currentBranch: string;
  distance: string;
  email: string;
  phone: string | null;
  lat: number;
  lng: number;
}

export interface RegionData {
  region: string;
  requests: number;
}

export interface StatusData {
  name: RequestStatus;
  value: number;
  color: string;
}
