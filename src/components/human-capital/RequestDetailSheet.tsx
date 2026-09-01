import { Mail } from "lucide-react";

import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ALLOWED_STATUS_TRANSITIONS } from "@/data/constants";
import type { HCRequest } from "@/types";

interface RequestDetailSheetProps {
  request: HCRequest | null;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (request: HCRequest) => void;
}

export function RequestDetailSheet({ request, onOpenChange, onChangeStatus }: RequestDetailSheetProps) {
  return (
    <Sheet open={!!request} onOpenChange={onOpenChange}>
      <SheetContent>
        {request && (
          <>
            <SheetHeader>
              <SheetTitle>{request.collaborator}</SheetTitle>
              <SheetDescription>Legajo {request.employeeId}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                <span className="text-xs text-stone-500">Sucursal actual</span>
                <span className="font-medium text-stone-800">{request.currentBranch}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                <span className="text-xs text-stone-500">Sucursal deseada</span>
                <span className="font-medium text-stone-800">{request.desiredBranch}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                <span className="text-xs text-stone-500">Motivo</span>
                <span className="font-medium text-stone-800">{request.reason}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                <span className="text-xs text-stone-500">Fecha</span>
                <span className="font-medium text-stone-800">{request.date}</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                <span className="text-xs text-stone-500">Estado</span>
                <StatusBadge status={request.status} code={request.statusCode} />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <Button
                className="w-full gap-2 bg-[#1F7A4D] hover:bg-[#19653F]"
                onClick={() => {
                  window.location.href = `mailto:${request.email}`;
                }}
              >
                <Mail className="h-4 w-4" /> Contactar
              </Button>
              {ALLOWED_STATUS_TRANSITIONS[request.statusCode].length > 0 && (
                <Button variant="outline" className="w-full" onClick={() => onChangeStatus(request)}>
                  Cambiar estado
                </Button>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
