import * as React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: () => void;
  onClear: () => void;
  applyDisabled?: boolean;
  children: React.ReactNode;
}

// Shared shell for every filter drawer in the app (HC's Solicitudes/Analytics
// tabs today, more elsewhere later) so they all render with the same
// structure — only the filter fields inside differ per screen.
export function FilterDrawer({
  open,
  onOpenChange,
  onApply,
  onClear,
  applyDisabled,
  children,
}: FilterDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <Separator />
        <div className="flex-1 space-y-4 overflow-y-auto">{children}</div>
        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onClear}>
            Quitar filtro
          </Button>
          <Button
            className="flex-1 bg-[#1F7A4D] hover:bg-[#19653F]"
            onClick={onApply}
            disabled={applyDisabled}
          >
            Aplicar filtro
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
