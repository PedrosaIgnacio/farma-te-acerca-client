import { AlertTriangle, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  icon: Icon = AlertTriangle,
  title = "No pudimos cargar la información",
  description = "Ocurrió un error al comunicarnos con el servidor. Probá de nuevo en unos segundos.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-500">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-red-700">{title}</p>
        {description && <p className="mt-1 text-sm text-red-600">{description}</p>}
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="gap-2 border-red-200 text-red-700 hover:bg-red-100"
        >
          Reintentar
        </Button>
      )}
    </div>
  );
}
