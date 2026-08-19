import * as React from "react";
import { BarChart3, ClipboardList, Filter } from "lucide-react";

import { AnalyticsFilterDrawer } from "@/components/human-capital/AnalyticsFilterDrawer";
import { AnalyticsTab } from "@/components/human-capital/AnalyticsTab";
import { SolicitudesTab } from "@/components/human-capital/SolicitudesTab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyticsDateFilter } from "@/hooks/useHcAnalytics";

export function HumanCapitalPage() {
  const [activeTab, setActiveTab] = React.useState<"solicitudes" | "analytics">("solicitudes");
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState<AnalyticsDateFilter | null>(null);

  const activeFilterCount = dateFilter ? 1 : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Capital Humano</h1>
        <p className="text-sm text-stone-500">Consultá solicitudes de relocalización y su analítica.</p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "solicitudes" | "analytics")}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="solicitudes" className="gap-1.5">
              <ClipboardList className="h-4 w-4" /> Solicitudes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5">
              <BarChart3 className="h-4 w-4" /> Analytics
            </TabsTrigger>
          </TabsList>

          {activeTab === "analytics" && (
            <div className="relative inline-flex">
              <Button variant="outline" size="sm" className="gap-2" onClick={() => setFilterOpen(true)}>
                <Filter className="h-4 w-4" /> Filtros
              </Button>
              {activeFilterCount > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#1F7A4D] p-0 text-[10px] text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
          )}
        </div>

        <TabsContent value="solicitudes" className="pt-4">
          <SolicitudesTab />
        </TabsContent>

        <TabsContent value="analytics" className="pt-4">
          <AnalyticsTab dateFilter={dateFilter} />
        </TabsContent>
      </Tabs>

      <AnalyticsFilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApply={setDateFilter}
        onClear={() => setDateFilter(null)}
      />
    </div>
  );
}
