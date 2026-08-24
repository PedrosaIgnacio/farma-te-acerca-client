import * as React from "react";
import { Download } from "lucide-react";
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

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHcAnalytics, type AnalyticsDateFilter } from "@/hooks/useHcAnalytics";
import { ApiError, apiBlob } from "@/lib/api";

interface AnalyticsTabProps {
  dateFilter: AnalyticsDateFilter | null;
}

export function AnalyticsTab({ dateFilter }: AnalyticsTabProps) {
  const { analytics, loading, error, params } = useHcAnalytics(dateFilter);

  const [exporting, setExporting] = React.useState(false);
  const [exportError, setExportError] = React.useState<string | null>(null);

  const handleExport = async () => {
    setExporting(true);
    setExportError(null);
    try {
      const blob = await apiBlob(`/hc/requests/export${params ? `?${params}` : ""}`);
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

  const kpis = analytics
    ? [
        { label: "Total solicitudes", value: analytics.kpis.totalSolicitudes },
        { label: "Activas", value: analytics.kpis.activas },
        { label: "Exitosas", value: analytics.kpis.exitosas },
        { label: "% de éxito", value: analytics.kpis.successRate },
      ]
    : [];

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }, (_, i) => (
              <Card key={i}>
                <CardContent className="space-y-2 pt-5">
                  <Skeleton className="h-7 w-12" />
                  <Skeleton className="h-3 w-20" />
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
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Solicitudes por región</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics?.regionData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EEEDE9" />
                  <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="requests" name="Solicitudes" fill="#1F7A4D" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Distribución por estado</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col items-end gap-2">
        {exportError && <p className="text-sm text-red-600">{exportError}</p>}
        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={exporting}>
          <Download className="h-4 w-4" /> {exporting ? "Descargando..." : "Descargar reporte"}
        </Button>
      </div>
    </div>
  );
}
