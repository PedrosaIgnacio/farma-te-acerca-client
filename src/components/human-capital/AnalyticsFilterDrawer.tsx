import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import type { AnalyticsDateFilter } from "@/hooks/useHcAnalytics";

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
): AnalyticsDateFilter | null {
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
  onApply: (filter: AnalyticsDateFilter) => void;
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

  const handleApply = () => {
    if (!period) return;
    const range = computeDateRange(period, customFrom, customTo);
    if (!range) return;
    onApply(range);
    onOpenChange(false);
  };

  const handleClear = () => {
    setPeriod(null);
    setCustomFrom("");
    setCustomTo("");
    onClear();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex-1 space-y-4 overflow-y-auto">
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
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleClear}>
            Quitar filtro
          </Button>
          <Button
            className="flex-1 bg-[#1F7A4D] hover:bg-[#19653F]"
            onClick={handleApply}
            disabled={!period || (period === "otro" && (!customFrom || !customTo))}
          >
            Aplicar filtro
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
