import { Badge } from "@/components/ui/badge";
import { STATUS_STYLES } from "@/data/constants";
import type { EstadoCodigo, RequestStatus } from "@/types";

export function StatusBadge({ status, code }: { status: RequestStatus; code: EstadoCodigo }) {
  return (
    <Badge variant="outline" className={`${STATUS_STYLES[code]} font-medium`}>
      {status}
    </Badge>
  );
}
