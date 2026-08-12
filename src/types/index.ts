export type Role = "collaborator" | "hc" | "dt";

export type Reason = "Mudanza" | "Movilidad" | "Estudios" | "Otro";

export type RequestStatus = "Activa" | "En curso" | "Cancelada" | "Finalizada";

export interface Session {
  user: string;
  role: Role;
}

export interface Branch {
  id: number;
  name: string;
  region: string;
  zone: string;
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
