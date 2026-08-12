import * as React from "react";
import { BarChart3, ClipboardList, Download, Mail, Search } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { EmptyState } from "@/components/shared/EmptyState";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { BranchSelect } from "@/components/shared/BranchSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HC_REQUESTS, STATUS_DATA, REGION_DATA } from "@/data/mockData";
import type { HCRequest } from "@/types";

const KPIS = [
  { label: "Total solicitudes", value: 88 },
  { label: "Activas", value: 22 },
  { label: "Exitosas", value: 41 },
  { label: "% de éxito", value: "47%" },
];

export function HumanCapitalPage() {
  const [branch, setBranch] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [selected, setSelected] = React.useState<HCRequest | null>(null);

  const filteredRequests = React.useMemo(() => {
    if (!show || !branch) return [];
    return HC_REQUESTS.filter((r) => r.desiredBranch === branch);
  }, [show, branch]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Capital Humano</h1>
        <p className="text-sm text-stone-500">Consultá solicitudes de relocalización y su analítica.</p>
      </div>

      <Tabs defaultValue="solicitudes">
        <TabsList>
          <TabsTrigger value="solicitudes" className="gap-1.5">
            <ClipboardList className="h-4 w-4" /> Solicitudes
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1.5">
            <BarChart3 className="h-4 w-4" /> Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="solicitudes" className="space-y-4 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <BranchSelect value={branch} onChange={setBranch} />
            </div>
            <Button
              onClick={() => setShow(true)}
              disabled={!branch}
              className="gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
            >
              <Search className="h-4 w-4" /> Mostrar solicitudes
            </Button>
          </div>

          {show && filteredRequests.length === 0 && (
            <EmptyState
              icon={ClipboardList}
              title="No hay solicitudes para esta sucursal"
              description="No se encontraron solicitudes de relocalización activas hacia la sucursal seleccionada."
            />
          )}

          {show && filteredRequests.length > 0 && (
            <Card>
              <CardContent className="p-0">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 text-left text-xs uppercase tracking-wide text-stone-400">
                      <th className="px-4 py-3 font-medium">Colaborador</th>
                      <th className="px-4 py-3 font-medium">Sucursal actual</th>
                      <th className="px-4 py-3 font-medium">Motivo</th>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelected(r)}
                        className="cursor-pointer border-b border-stone-50 last:border-0 hover:bg-stone-50"
                      >
                        <td className="px-4 py-3 font-medium text-stone-800">{r.collaborator}</td>
                        <td className="px-4 py-3 text-stone-600">{r.currentBranch}</td>
                        <td className="px-4 py-3 text-stone-600">{r.reason}</td>
                        <td className="px-4 py-3 text-stone-600">{r.date}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={r.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {KPIS.map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="pt-5">
                  <p className="text-2xl font-semibold text-stone-800">{kpi.value}</p>
                  <p className="text-xs text-stone-500">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Solicitudes por región</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={REGION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEEDE9" />
                    <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="requests" fill="#1F7A4D" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Distribución por estado</CardTitle>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={STATUS_DATA} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                      {STATUS_DATA.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" /> Descargar reporte
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <Sheet open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <SheetContent>
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>{selected.collaborator}</SheetTitle>
                <SheetDescription>Legajo {selected.employeeId}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500">Sucursal actual</span>
                  <span className="font-medium text-stone-800">{selected.currentBranch}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500">Sucursal deseada</span>
                  <span className="font-medium text-stone-800">{selected.desiredBranch}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500">Motivo</span>
                  <span className="font-medium text-stone-800">{selected.reason}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500">Fecha</span>
                  <span className="font-medium text-stone-800">{selected.date}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                  <span className="text-xs text-stone-500">Estado</span>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <Button className="mt-6 w-full gap-2 bg-[#1F7A4D] hover:bg-[#19653F]">
                <Mail className="h-4 w-4" /> Contactar
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
