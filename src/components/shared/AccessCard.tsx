import { ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface AccessCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  className?: string;
}

// Big CTA card used at the top of a section for its primary "create" action
// (e.g. "Nueva solicitud", "Nueva sucursal") — extracted from the
// HistoryPage/SolicitudesPage markup, which duplicated this exact block.
export function AccessCard({ icon: Icon, title, description, onClick, className }: AccessCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full max-w-md items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-5 text-left shadow-sm transition hover:border-[#1F7A4D]/40 hover:shadow-md",
        className,
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#1F7A4D]/10 text-[#1F7A4D]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1">
        <p className="text-base font-bold text-stone-800">{title}</p>
        <p className="text-xs text-stone-500">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-stone-300" />
    </button>
  );
}
