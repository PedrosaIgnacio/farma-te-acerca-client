import { Building2, ClipboardList, Users, type LucideIcon } from "lucide-react";

import type { Role } from "@/types";

export const ROLE_LABEL: Record<Role, string> = {
  collaborator: "Colaborador",
  hc: "Capital Humano",
  dt: "DT de sucursal",
};

export const ROLE_HOME: Record<Role, string> = {
  collaborator: "/colaborador",
  hc: "/capital-humano",
  dt: "/dt",
};

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

export const NAV: Record<Role, NavItem[]> = {
  collaborator: [{ path: ROLE_HOME.collaborator, label: "Mis solicitudes", icon: ClipboardList }],
  hc: [{ path: ROLE_HOME.hc, label: "Capital Humano", icon: Building2 }],
  dt: [{ path: ROLE_HOME.dt, label: "Colaboradores cercanos", icon: Users }],
};
