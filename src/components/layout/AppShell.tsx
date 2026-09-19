import * as React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { AppHeader } from "@/components/layout/AppHeader";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { NAV, ROLE_LABEL } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";

export function AppShell() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  if (!session) return null;

  const nav = NAV[session.role];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#F6F7F3]">
      <AppHeader
        user={session.user}
        role={session.role}
        onLogout={handleLogout}
        onMenuClick={() => setMobileNavOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-stone-200 bg-white p-4 sm:block">
          <SidebarNav nav={nav} />
        </aside>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-64 p-4">
          <SheetHeader className="mb-2">
            <SheetTitle>{ROLE_LABEL[session.role]}</SheetTitle>
          </SheetHeader>
          <SidebarNav nav={nav} onNavigate={() => setMobileNavOpen(false)} />
        </SheetContent>
      </Sheet>
    </div>
  );
}
