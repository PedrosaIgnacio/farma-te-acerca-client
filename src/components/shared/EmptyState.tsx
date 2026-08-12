import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-stone-200 px-4 py-10 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-400">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-medium text-stone-700">{title}</p>
        {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
      </div>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="gap-2 bg-[#1F7A4D] hover:bg-[#19653F]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
