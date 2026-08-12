import { LogOut, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROLE_LABEL } from "@/config/navigation";
import type { Role } from "@/types";

interface AppHeaderProps {
  user: string;
  role: Role;
  onLogout: () => void;
}

export function AppHeader({ user, role, onLogout }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-stone-200 bg-white/90 px-6 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1F7A4D] text-white">
          <MapPin className="h-4 w-4" />
        </div>
        <span className="font-semibold text-stone-800">FarmaTeAcerca</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight">
          <p className="text-sm font-medium text-stone-800">{user}</p>
          <p className="text-xs text-stone-500">{ROLE_LABEL[role]}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar sesión">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
