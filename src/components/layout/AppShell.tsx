import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { AppHeader } from "@/components/layout/AppHeader";
import { NAV } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";

export function AppShell() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  if (!session) return null;

  const nav = NAV[session.role];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex h-screen flex-col bg-[#F6F7F3]">
      <AppHeader user={session.user} role={session.role} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-stone-200 bg-white p-4 sm:block">
          <nav className="space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#1F7A4D]/10 text-[#1F7A4D]"
                      : "text-stone-600 hover:bg-stone-50"
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
