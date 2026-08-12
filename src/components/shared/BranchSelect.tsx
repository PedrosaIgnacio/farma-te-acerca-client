import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BRANCHES } from "@/data/mockData";

interface BranchSelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BranchSelect({
  value,
  onChange,
  placeholder = "Seleccioná una sucursal",
}: BranchSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {BRANCHES.map((b) => (
          <SelectItem key={b.id} value={b.name}>
            {b.name} <span className="text-stone-400">— {b.region}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
