import * as React from "react";

import { FilterDrawer } from "@/components/shared/FilterDrawer";
import { BranchSelect } from "@/components/shared/BranchSelect";
import { Label } from "@/components/ui/label";

interface SolicitudesFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (branchId: string) => void;
  onClear: () => void;
}

export function SolicitudesFilterDrawer({
  open,
  onOpenChange,
  onApply,
  onClear,
}: SolicitudesFilterDrawerProps) {
  const [branchId, setBranchId] = React.useState("");

  const handleApply = () => {
    if (!branchId) return;
    onApply(branchId);
    onOpenChange(false);
  };

  const handleClear = () => {
    setBranchId("");
    onClear();
    onOpenChange(false);
  };

  return (
    <FilterDrawer
      open={open}
      onOpenChange={onOpenChange}
      onApply={handleApply}
      onClear={handleClear}
      applyDisabled={!branchId}
    >
      <div className="flex flex-col gap-2">
        <Label className="text-sm font-medium text-stone-700">Filtrar por sucursal deseada</Label>
        <BranchSelect value={branchId} onChange={setBranchId} />
      </div>
    </FilterDrawer>
  );
}
