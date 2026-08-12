import { Badge } from "@/components/ui/badge";
import { STATUS_STYLES } from "@/data/constants";
import type { RequestStatus } from "@/types";

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge variant="outline" className={`${STATUS_STYLES[status]} font-medium`}>
      {status}
    </Badge>
  );
}
