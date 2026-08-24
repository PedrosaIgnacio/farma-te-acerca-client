import { STATUS_DOT_COLORS } from "@/data/constants";
import type { RequestStatusHistoryEntry } from "@/types";

interface RequestTimelineProps {
  history: RequestStatusHistoryEntry[];
}

export function RequestTimeline({ history }: RequestTimelineProps) {
  return (
    <ol>
      {history.map((entry, index) => {
        const isCurrent = entry.endDate === null;
        const isLast = index === history.length - 1;
        return (
          <li key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                aria-hidden
                className="absolute left-[7px] top-4 h-[calc(100%-1rem)] w-px bg-stone-200"
              />
            )}
            <span
              aria-hidden
              className={`relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-white shadow ${STATUS_DOT_COLORS[entry.status]} ${
                isCurrent ? "ring-4 ring-[#1F7A4D]/20" : ""
              }`}
            />
            <div className="flex-1 pt-0.5">
              <p className={`text-sm font-semibold ${isCurrent ? "text-stone-900" : "text-stone-700"}`}>
                {entry.status}
                {isCurrent && (
                  <span className="ml-2 text-xs font-medium text-[#1F7A4D]">Estado actual</span>
                )}
              </p>
              <p className="mt-1 text-xs text-stone-500">Tu solicitud se encuentra {entry.status.toLowerCase()}</p>
              <p className="text-xs text-stone-500">{entry.startDate}</p>
              {entry.motivo && (
                <div className="mt-2 flex flex-col gap-1">
                  <span className="text-xs text-stone-500">Motivo</span>
                  <span className="text-sm font-medium text-stone-800">{entry.motivo}</span>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
