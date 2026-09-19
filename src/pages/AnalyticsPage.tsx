import * as React from "react";
import { Filter } from "lucide-react";

import { AnalyticsFilterDrawer } from "@/components/human-capital/AnalyticsFilterDrawer";
import { AnalyticsTab } from "@/components/human-capital/AnalyticsTab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AnalyticsFilters } from "@/types";

export function AnalyticsPage() {
  const [filterOpen, setFilterOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<AnalyticsFilters | null>(null);

  const activeFilterCount = (filters?.from ? 1 : 0) + (filters?.region ? 1 : 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Analíticas</h1>
          <p className="text-sm text-stone-500">
            Indicadores y tendencias de las solicitudes de relocalización.
          </p>
        </div>

        <div className="relative inline-flex shrink-0">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setFilterOpen(true)}>
            <Filter className="h-4 w-4" /> Filtros
          </Button>
          {activeFilterCount > 0 && (
            <Badge className="absolute -right-2 -top-2 h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#1F7A4D] p-0 text-[10px] text-white">
              {activeFilterCount}
            </Badge>
          )}
        </div>
      </div>

      <AnalyticsTab filters={filters} />

      <AnalyticsFilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        onApply={setFilters}
        onClear={() => setFilters(null)}
      />
    </div>
  );
}
