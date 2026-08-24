import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBranches } from "@/hooks/useBranches";

interface BranchSelectProps {
  /** Selected branch id, as a string (Radix Select values are strings). */
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BranchSelect({
  value,
  onChange,
  placeholder = "Seleccioná una sucursal",
}: BranchSelectProps) {
  const { branches, loading } = useBranches();

  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Cargando sucursales..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {branches.map((b) => (
          <SelectItem key={b.id} value={String(b.id)}>
            {b.name} <span className="text-stone-400">— {b.region}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
