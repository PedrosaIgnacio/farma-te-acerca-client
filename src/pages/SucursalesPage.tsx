import * as React from "react";
import { Plus } from "lucide-react";

import { SucursalesTable } from "@/components/human-capital/SucursalesTable";
import { AccessCard } from "@/components/shared/AccessCard";

export function SucursalesPage() {
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Sucursales</h1>
        <p className="text-sm text-stone-500">Gestioná las sucursales de la cadena.</p>
      </div>

      <AccessCard
        icon={Plus}
        title="Nueva sucursal"
        description="Cargá una nueva sucursal de la cadena."
        onClick={() => setCreateOpen(true)}
      />

      <SucursalesTable createOpen={createOpen} onCreateOpenChange={setCreateOpen} />
    </div>
  );
}
