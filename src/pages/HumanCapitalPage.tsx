import * as React from "react";
import { BarChart3, ClipboardList, Download, Mail, MoreVertical, Search } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { STATUSES } from "@/data/constants";
import { ApiError, apiBlob, apiJson } from "@/lib/api";
import type { AnalyticsResponse, HCRequest, RequestStatus } from "@/types";

export function HumanCapitalPage() {
  const [branchId, setBranchId] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [requests, setRequests] = React.useState<HCRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = React.useState(false);
  const [requestsError, setRequestsError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<HCRequest | null>(null);
  const [statusTarget, setStatusTarget] = React.useState<HCRequest | null>(null);
  const [newStatus, setNewStatus] = React.useState<RequestStatus | null>(null);
  const [motivo, setMotivo] = React.useState("");
  const [statusUpdating, setStatusUpdating] = React.useState(false);
  const [statusError, setStatusError] = React.useState<string | null>(null);

  const [analytics, setAnalytics] = React.useState<AnalyticsResponse | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = React.useState(true);
  const [analyticsError, setAnalyticsError] = React.useState<string | null>(null);

  const [exporting, setExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    apiJson<AnalyticsResponse>("/hc/analytics")
      .then((data) => {
        if (!cancelled) setAnalytics(data);
      })
      .catch((err) => {
        if (!cancelled)
          setAnalyticsError(err instanceof ApiError ? err.message : "No se pudo cargar la analítica.");
      })
      .finally(() => {
        if (!cancelled) setAnalyticsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleShow = async () => {
    if (!branchId) return;
    setShow(true);
    setRequestsLoading(true);
    setRequestsError(null);
    try {
      const data = await apiJson<HCRequest[]>(`/hc/requests?desiredBranchId=${branchId}`);
      setRequests(data);
    } catch (err) {
      setRequestsError(
        err instanceof ApiError ? err.message : "No se pudieron cargar las solicitudes.",
      );
    } finally {
      setRequestsLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const blob = await apiBlob("/hc/requests/export");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "solicitudes.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setExportError(err instanceof ApiError ? err.message : "No se pudo descargar el reporte.");
    } finally {
      setExporting(false);
    }
  };

  const openStatusDialog = (r: HCRequest) => {
    setStatusTarget(r);
    setNewStatus(r.status);
    setMotivo("");
    setStatusError(null);
  };

  const closeStatusDialog = () => {
    setStatusTarget(null);
    setNewStatus(null);
    setMotivo("");
    setStatusError(null);
  };

  const handleSubmitStatus = async () => {
    if (!statusTarget || !newStatus || !motivo.trim() || newStatus === statusTarget.status) return;
    setStatusUpdating(true);
    setStatusError(null);
    try {
      const updated = await apiJson<HCRequest>(`/hc/requests/${statusTarget.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus, motivo: motivo.trim() }),
      });
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelected((prev) => (prev?.id === updated.id ? updated : prev));
      closeStatusDialog();
    } catch (err) {
      setStatusError(err instanceof ApiError ? err.message : "No se pudo actualizar el estado.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const kpis = analytics
    ? [
        { label: "Total solicitudes", value: analytics.kpis.totalSolicitudes },
        { label: "Activas", value: analytics.kpis.activas },
        { label: "Exitosas", value: analytics.kpis.exitosas },
        { label: "% de éxito", value: analytics.kpis.successRate },
      ]
    : [];

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
              <BranchSelect value={branchId} onChange={setBranchId} />
            </div>
            <Button
              onClick={handleShow}
              disabled={!branchId || requestsLoading}
              className="gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
            >
              <Search className="h-4 w-4" /> Mostrar solicitudes
            </Button>
          </div>

          {show && requestsLoading && (
            <p className="py-6 text-center text-sm text-stone-400">Cargando solicitudes...</p>
          )}

          {show && !requestsLoading && requestsError && (
            <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {requestsError}
            </p>
          )}

          {show && !requestsLoading && !requestsError && requests.length === 0 && (
            <EmptyState
              icon={ClipboardList}
              title="No hay solicitudes para esta sucursal"
              description="No se encontraron solicitudes de relocalización activas hacia la sucursal seleccionada."
            />
          )}

          {show && !requestsLoading && !requestsError && requests.length > 0 && (
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
                      <th className="px-4 py-3 font-medium">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
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
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-4 w-4" />
                                <span className="sr-only">Acciones</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={() => openStatusDialog(r)}>
                                Cambiar estado
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
          {analyticsError && (
            <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {analyticsError}
            </p>
          )}

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {analyticsLoading
              ? Array.from({ length: 4 }, (_, i) => (
                  <Card key={i}>
                    <CardContent className="pt-5">
                      <p className="text-2xl font-semibold text-stone-800">—</p>
                    </CardContent>
                  </Card>
                ))
              : kpis.map((kpi) => (
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
                  <BarChart data={analytics?.regionData ?? []}>
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
                    <Pie
                      data={analytics?.statusData ?? []}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={80}
                    >
                      {(analytics?.statusData ?? []).map((d) => (
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

          <div className="flex flex-col items-end gap-2">
            {exportError && <p className="text-sm text-red-600">{exportError}</p>}
            <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4" /> {exporting ? "Descargando..." : "Descargar reporte"}
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

              <Button
                className="mt-6 w-full gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
                onClick={() => {
                  window.location.href = `mailto:${selected.email}`;
                }}
              >
                <Mail className="h-4 w-4" /> Contactar
              </Button>
            </>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={!!statusTarget} onOpenChange={(v) => !v && closeStatusDialog()}>
        <DialogContent>
          {statusTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Cambiar estado</DialogTitle>
                <DialogDescription>
                  {statusTarget.collaborator} — solicitud a {statusTarget.desiredBranch}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Nuevo estado</Label>
                  <Select
                    value={newStatus ?? undefined}
                    onValueChange={(v) => setNewStatus(v as RequestStatus)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label>Motivo</Label>
                  <Textarea
                    maxLength={240}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Explicá el motivo del cambio de estado..."
                  />
                </div>

                {statusError && <p className="text-sm text-red-600">{statusError}</p>}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={closeStatusDialog}>
                  Cancelar
                </Button>
                <Button
                  className="bg-[#1F7A4D] hover:bg-[#19653F]"
                  onClick={handleSubmitStatus}
                  disabled={
                    statusUpdating || !motivo.trim() || !newStatus || newStatus === statusTarget.status
                  }
                >
                  {statusUpdating ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
