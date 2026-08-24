import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { HcCollaborator } from "@/types";

interface CollaboratorSelectProps {
  value: string;
  onChange: (value: string) => void;
  collaborators: HcCollaborator[];
  loading?: boolean;
  placeholder?: string;
}

// Takes the collaborator list as a prop instead of fetching it itself
// (unlike BranchSelect) because the page that renders this also needs the
// list to resolve the selected collaborator's current branch.
export function CollaboratorSelect({
  value,
  onChange,
  collaborators,
  loading = false,
  placeholder = "Seleccioná un colaborador",
}: CollaboratorSelectProps) {
  return (
    <Select value={value} onValueChange={onChange} disabled={loading}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={loading ? "Cargando colaboradores..." : placeholder} />
      </SelectTrigger>
      <SelectContent>
        {collaborators.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name} <span className="text-stone-400">— Legajo {c.legajo}</span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
