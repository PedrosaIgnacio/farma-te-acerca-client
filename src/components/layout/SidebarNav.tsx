import { NavLink } from "react-router-dom";

import type { NavItem } from "@/config/navigation";

interface SidebarNavProps {
  nav: NavItem[];
  onNavigate?: () => void;
}

export function SidebarNav({ nav, onNavigate }: SidebarNavProps) {
  return (
    <nav className="space-y-1">
      {nav.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              isActive ? "bg-[#1F7A4D]/10 text-[#1F7A4D]" : "text-stone-600 hover:bg-stone-50"
            }`
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
