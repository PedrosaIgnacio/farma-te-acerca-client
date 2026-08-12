import type {
  Branch,
  HCRequest,
  NearbyEmployee,
  Reason,
  RegionData,
  RequestHistoryEntry,
  RequestStatus,
  StatusData,
} from "@/types";

export const BRANCHES: Branch[] = [
  { id: 1, name: "Farmacity Palermo", region: "CABA", zone: "Norte" },
  { id: 2, name: "Farmacity Belgrano", region: "CABA", zone: "Norte" },
  { id: 3, name: "Farmacity Rosario Centro", region: "Santa Fe", zone: "Centro" },
  { id: 4, name: "Farmacity Córdoba Nueva Córdoba", region: "Córdoba", zone: "Centro" },
  { id: 5, name: "Farmacity Mendoza Centro", region: "Mendoza", zone: "Cuyo" },
  { id: 6, name: "Farmacity Salta Centro", region: "Salta", zone: "NOA" },
  { id: 7, name: "Farmacity Montevideo Pocitos", region: "Uruguay", zone: "Uruguay" },
  { id: 8, name: "Farmacity Mar del Plata", region: "Buenos Aires", zone: "Costa" },
];

export const REASONS: Reason[] = ["Mudanza", "Movilidad", "Estudios", "Otro"];

export const STATUS_STYLES: Record<RequestStatus, string> = {
  Activa: "bg-sky-100 text-sky-700 border-sky-200",
  "En curso": "bg-amber-100 text-amber-700 border-amber-200",
  Cancelada: "bg-stone-100 text-stone-600 border-stone-200",
  Finalizada: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export const INITIAL_HISTORY: RequestHistoryEntry[] = [
  { id: 1231, branch: "Farmacity Rosario Centro", date: "12/06/2026", status: "Finalizada" },
  { id: 1198, branch: "Farmacity Córdoba Nueva Córdoba", date: "02/04/2026", status: "Cancelada" },
];

export const HC_REQUESTS: HCRequest[] = [
  {
    id: 1301,
    collaborator: "Lucía Fernández",
    employeeId: "44210",
    currentBranch: "Farmacity Palermo",
    desiredBranch: "Farmacity Mar del Plata",
    reason: "Mudanza",
    date: "28/07/2026",
    status: "Activa",
    email: "lucia.fernandez@farmacity.com",
  },
  {
    id: 1299,
    collaborator: "Nahuel Ortiz",
    employeeId: "39871",
    currentBranch: "Farmacity Belgrano",
    desiredBranch: "Farmacity Córdoba Nueva Córdoba",
    reason: "Estudios",
    date: "25/07/2026",
    status: "En curso",
    email: "nahuel.ortiz@farmacity.com",
  },
  {
    id: 1287,
    collaborator: "Carla Gómez",
    employeeId: "41022",
    currentBranch: "Farmacity Mar del Plata",
    desiredBranch: "Farmacity Palermo",
    reason: "Movilidad",
    date: "20/07/2026",
    status: "Activa",
    email: "carla.gomez@farmacity.com",
  },
];

export const NEARBY_EMPLOYEES: NearbyEmployee[] = [
  {
    id: 1,
    name: "Martina Suárez",
    employeeId: "40217",
    currentBranch: "Farmacity Belgrano",
    distance: "1.8 km",
    email: "martina.suarez@farmacity.com",
  },
  {
    id: 2,
    name: "Diego Ramallo",
    employeeId: "38790",
    currentBranch: "Farmacity Palermo",
    distance: "2.4 km",
    email: "diego.ramallo@farmacity.com",
  },
  {
    id: 3,
    name: "Rocío Álvarez",
    employeeId: "42551",
    currentBranch: "Farmacity Núñez",
    distance: "3.1 km",
    email: "rocio.alvarez@farmacity.com",
  },
];

export const REGION_DATA: RegionData[] = [
  { region: "CABA", requests: 34 },
  { region: "Buenos Aires", requests: 21 },
  { region: "Córdoba", requests: 14 },
  { region: "Santa Fe", requests: 9 },
  { region: "Mendoza", requests: 6 },
  { region: "Uruguay", requests: 4 },
];

export const STATUS_DATA: StatusData[] = [
  { name: "Activa", value: 22, color: "#0284C7" },
  { name: "En curso", value: 15, color: "#D97706" },
  { name: "Finalizada", value: 41, color: "#1F7A4D" },
  { name: "Cancelada", value: 10, color: "#78716C" },
];
