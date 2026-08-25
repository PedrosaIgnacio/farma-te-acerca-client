import * as React from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { CancelRequestDialog } from "@/components/collaborator/CancelRequestDialog";
import { RequestTimeline } from "@/components/collaborator/RequestTimeline";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { CANCELABLE_STATUSES } from "@/data/constants";
import { useRequestDetail } from "@/hooks/useRequestDetail";

export function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { request, loading, error } = useRequestDetail(id);
  const [cancelling, setCancelling] = React.useState(false);

  return (
    <div className="p-6">
      <div className="grid grid-cols-12">
        <div className="col-span-12 space-y-6 lg:col-span-8 lg:col-start-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => navigate("/colaborador")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-stone-800">
                  Solicitud N° {id ?? ""}
                </h1>
                <p className="text-sm text-stone-500">Detalle y estados por los que pasó tu solicitud.</p>
              </div>
            </div>

            {request && CANCELABLE_STATUSES.includes(request.status) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Acciones</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCancelling(true)}>
                    Cancelar solicitud
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {loading ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Datos de la solicitud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {Array.from({ length: 6 }, (_, i) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-stone-100 pb-2 last:border-0">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Estado de la Solicitud</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol>
                    {Array.from({ length: 2 }, (_, i) => (
                      <li key={i} className="relative flex gap-4 pb-8 last:pb-0">
                        {i === 0 && (
                          <span
                            aria-hidden
                            className="absolute left-[7px] top-4 h-[calc(100%-1rem)] w-px bg-stone-200"
                          />
                        )}
                        <Skeleton className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full" />
                        <div className="flex-1 space-y-2 pt-0.5">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-48" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </>
          ) : error ? (
            <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          ) : request ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Datos de la solicitud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
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
                    <span className="font-medium text-stone-800">
                      {request.reason === "Otro" && request.otherReason
                        ? request.otherReason
                        : request.reason}
                    </span>
                  </div>
                  {request.description && (
                    <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                      <span className="text-xs text-stone-500">Descripción</span>
                      <span className="font-medium text-stone-800">{request.description}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 border-b border-stone-100 pb-2">
                    <span className="text-xs text-stone-500">Fecha de solicitud</span>
                    <span className="font-medium text-stone-800">{request.date}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-stone-500">Estado actual</span>
                    <StatusBadge status={request.status} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Estado de la Solicitud</CardTitle>
                </CardHeader>
                <CardContent>
                  <RequestTimeline history={request.history} />
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>

      <CancelRequestDialog
        request={cancelling && request ? { id: request.id, branch: request.desiredBranch } : null}
        onOpenChange={(open) => !open && setCancelling(false)}
        onCancelled={() => navigate("/colaborador")}
      />
    </div>
  );
}
