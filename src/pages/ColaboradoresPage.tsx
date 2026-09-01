import * as React from "react";
import { Plus } from "lucide-react";

import { ColaboradoresTable } from "@/components/human-capital/ColaboradoresTable";
import { AccessCard } from "@/components/shared/AccessCard";

export function ColaboradoresPage() {
  const [createOpen, setCreateOpen] = React.useState(false);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-800">Colaboradores</h1>
        <p className="text-sm text-stone-500">Gestioná las cuentas de colaboradores, capital humano y DT.</p>
      </div>

      <AccessCard
        icon={Plus}
        title="Nuevo colaborador"
        description="Cargá una cuenta nueva para un colaborador, capital humano o DT."
        onClick={() => setCreateOpen(true)}
      />

      <ColaboradoresTable createOpen={createOpen} onCreateOpenChange={setCreateOpen} />
    </div>
  );
}
