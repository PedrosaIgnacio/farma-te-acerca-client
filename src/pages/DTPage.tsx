import * as React from "react";
import { ChevronRight, Mail, MapPin, Search, Users } from "lucide-react";

import { BranchSelect } from "@/components/shared/BranchSelect";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NEARBY_EMPLOYEES } from "@/data/mockData";
import type { NearbyEmployee } from "@/types";

export function DTPage() {
  const [branch, setBranch] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [selected, setSelected] = React.useState<NearbyEmployee | null>(null);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-stone-800">Colaboradores cercanos</h1>
        <p className="text-sm text-stone-500">
          Consultá colaboradores disponibles cerca de tu sucursal ante una contingencia.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <BranchSelect value={branch} onChange={setBranch} />
        </div>
        <Button
          onClick={() => setShow(true)}
          disabled={!branch}
          className="gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
        >
          <Search className="h-4 w-4" /> Mostrar colaboradores cercanos
        </Button>
      </div>

      {show && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEARBY_EMPLOYEES.map((e) => (
            <Card
              key={e.id}
              className="cursor-pointer transition hover:border-[#1F7A4D]/40 hover:shadow-sm"
              onClick={() => setSelected(e)}
            >
              <CardContent className="pt-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#1F7A4D]/10 text-[#1F7A4D]">
                  <Users className="h-5 w-5" />
                </div>
                <p className="font-medium text-stone-800">{e.name}</p>
                <p className="text-xs text-stone-500">{e.currentBranch}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline" className="gap-1 border-stone-200 text-stone-600">
                    <MapPin className="h-3 w-3" /> {e.distance}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-stone-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="sm:max-w-sm">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
                <DialogDescription>Legajo {selected.employeeId}</DialogDescription>
              </DialogHeader>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Sucursal actual</span>
                  <span className="font-medium text-stone-800">{selected.currentBranch}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-2">
                  <span className="text-stone-500">Distancia</span>
                  <span className="font-medium text-stone-800">{selected.distance}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-stone-500">Email</span>
                  <span className="font-medium text-stone-800">{selected.email}</span>
                </div>
              </div>
              <DialogFooter>
                <Button className="w-full gap-2 bg-[#1F7A4D] hover:bg-[#19653F]">
                  <Mail className="h-4 w-4" /> Solicitar cobertura
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
