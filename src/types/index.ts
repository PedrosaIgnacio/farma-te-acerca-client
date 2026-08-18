export type Role = "collaborator" | "hc" | "dt";

export type Reason = "Mudanza" | "Movilidad" | "Estudios" | "Otro";

export type RequestStatus = "Activa" | "En curso" | "Cancelada" | "Finalizada";

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
  status: RequestStatus;
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
}

export interface RequestHistoryEntry {
  id: number;
  branch: string;
  date: string;
  status: RequestStatus;
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
  email: string;
}

export interface NearbyEmployee {
  id: number;
  name: string;
  employeeId: string;
  currentBranch: string;
  distance: string;
  email: string;
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
