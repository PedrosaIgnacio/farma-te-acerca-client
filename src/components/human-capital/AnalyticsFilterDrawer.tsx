import * as React from "react";

import { FilterDrawer } from "@/components/shared/FilterDrawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useHcProvincias } from "@/hooks/useHcProvincias";

import type { AnalyticsFilters } from "@/types";

type PeriodOption = "hoy" | "ayer" | "7" | "15" | "30" | "otro";

const PERIOD_OPTIONS: { value: PeriodOption; label: string }[] = [
  { value: "hoy", label: "Hoy" },
  { value: "ayer", label: "Ayer" },
  { value: "7", label: "Últimos 7 días" },
  { value: "15", label: "Últimos 15 días" },
  { value: "30", label: "Últimos 30 días" },
  { value: "otro", label: "Otro período" },
];

function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function computeDateRange(
  period: PeriodOption,
  customFrom: string,
  customTo: string,
): { from: string; to: string } | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  switch (period) {
    case "hoy": {
      const d = toIsoDate(today);
      return { from: d, to: d };
    }
    case "ayer": {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const d = toIsoDate(yesterday);
      return { from: d, to: d };
    }
    case "7":
    case "15":
    case "30": {
      const from = new Date(today);
      from.setDate(from.getDate() - (Number(period) - 1));
      return { from: toIsoDate(from), to: toIsoDate(today) };
    }
    case "otro": {
      if (!customFrom || !customTo) return null;
      return { from: customFrom, to: customTo };
    }
  }
}

interface AnalyticsFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filter: AnalyticsFilters) => void;
  onClear: () => void;
}

export function AnalyticsFilterDrawer({
  open,
  onOpenChange,
  onApply,
  onClear,
}: AnalyticsFilterDrawerProps) {
  const [period, setPeriod] = React.useState<PeriodOption | null>(null);
  const [customFrom, setCustomFrom] = React.useState("");
  const [customTo, setCustomTo] = React.useState("");
  const [region, setRegion] = React.useState<string | null>(null);

  const { provincias, loading: regionsLoading } = useHcProvincias();
  const regions = React.useMemo(
    () => [...new Set(provincias.map((p) => p.region.nombre))].sort((a, b) => a.localeCompare(b)),
    [provincias],
  );

  const handleApply = () => {
    const range = period ? computeDateRange(period, customFrom, customTo) : null;
    if (period && !range) return;
    onApply({ ...range, region: region ?? undefined });
    onOpenChange(false);
  };

  const handleClear = () => {
    setPeriod(null);
    setCustomFrom("");
    setCustomTo("");
    setRegion(null);
    onClear();
    onOpenChange(false);
  };

  return (
    <FilterDrawer
      open={open}
      onOpenChange={onOpenChange}
      onApply={handleApply}
      onClear={handleClear}
      applyDisabled={
        (!period && !region) || (period === "otro" && (!customFrom || !customTo))
      }
    >
      <div className="flex flex-col gap-4">
        <Label className="text-sm font-medium text-stone-700">Filtrar por región</Label>
        {regionsLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup
            className="gap-4"
            value={region ?? undefined}
            onValueChange={(v) => setRegion(v)}
          >
            {regions.map((r) => (
              <div key={r} className="flex items-center gap-2">
                <RadioGroupItem value={r} id={`region-${r}`} />
                <Label htmlFor={`region-${r}`} className="font-normal">
                  {r}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex flex-col gap-4">
        <Label className="text-sm font-medium text-stone-700">Filtrar por período</Label>
        <RadioGroup
          className="gap-4"
          value={period ?? undefined}
          onValueChange={(v) => setPeriod(v as PeriodOption)}
        >
          {PERIOD_OPTIONS.map((opt) => (
            <div key={opt.value} className="flex items-center gap-2">
              <RadioGroupItem value={opt.value} id={`period-${opt.value}`} />
              <Label htmlFor={`period-${opt.value}`} className="font-normal">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {period === "otro" && (
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="fecha-desde">Fecha desde</Label>
            <Input
              id="fecha-desde"
              type="date"
              value={customFrom}
              max={customTo || undefined}
              onChange={(e) => setCustomFrom(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fecha-hasta">Fecha hasta</Label>
            <Input
              id="fecha-hasta"
              type="date"
              value={customTo}
              min={customFrom || undefined}
              onChange={(e) => setCustomTo(e.target.value)}
            />
          </div>
        </div>
      )}
    </FilterDrawer>
  );
}
