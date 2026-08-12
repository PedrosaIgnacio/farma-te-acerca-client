import * as React from "react";
import { MapPin } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_HOME } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/types";

const MAX_ATTEMPTS = 5;

export function LoginPage() {
  const { session, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [attempts, setAttempts] = React.useState(0);
  const [error, setError] = React.useState("");
  const [role, setRole] = React.useState<Role>("collaborator");
  const [forgotOpen, setForgotOpen] = React.useState(false);

  if (session) {
    return <Navigate to={ROLE_HOME[session.role]} replace />;
  }

  const handleLogin = (user: string, selectedRole: Role) => {
    login(user, selectedRole);
    navigate(ROLE_HOME[selectedRole], { replace: true });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !pass) {
      setError("Ingresá tu usuario y contraseña.");
      return;
    }
    if (pass !== "demo") {
      const next = attempts + 1;
      setAttempts(next);
      setError(
        next >= MAX_ATTEMPTS
          ? "Usuario bloqueado por intentos fallidos. Restablecé tu contraseña."
          : "Usuario o contraseña incorrectos.",
      );
      return;
    }
    handleLogin(username, role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F7F3] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1F7A4D] text-white shadow-sm">
            <MapPin className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold text-stone-800">FarmaTeAcerca</h1>
          <p className="text-sm text-stone-500">Gestión de relocalización de colaboradores</p>
        </div>

        <Card className="border-stone-200 shadow-sm">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Usuario o legajo</Label>
                <Input
                  id="username"
                  placeholder="Ej: 44210"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pass">Contraseña</Label>
                <Input
                  id="pass"
                  type="password"
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                <p className="text-xs text-stone-400">Pista demo: contraseña "demo"</p>
              </div>

              {/* Role selector for the demo — in production this would be resolved by the backend based on the authenticated employee ID/username */}
              <div className="space-y-1.5">
                <Label htmlFor="role">Rol (demo)</Label>
                <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collaborator">Colaborador de sucursal</SelectItem>
                    <SelectItem value="hc">Capital Humano</SelectItem>
                    <SelectItem value="dt">DT de sucursal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full bg-[#1F7A4D] hover:bg-[#19653F]">
                Iniciar sesión
              </Button>

              <div className="flex items-center gap-2 py-1">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="text-xs text-stone-400">o</span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => handleLogin("usuario.365@farmacity.com", role)}
              >
                <svg width="16" height="16" viewBox="0 0 23 23">
                  <path fill="#f35325" d="M1 1h10v10H1z" />
                  <path fill="#81bc06" d="M12 1h10v10H12z" />
                  <path fill="#05a6f0" d="M1 12h10v10H1z" />
                  <path fill="#ffba08" d="M12 12h10v10H12z" />
                </svg>
                Iniciar sesión con Microsoft 365
              </Button>

              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="block w-full text-center text-sm text-[#1F7A4D] hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-stone-400">Farmacity · People Analytics</p>
      </div>

      <ForgotPasswordDialog open={forgotOpen} onOpenChange={setForgotOpen} />
    </div>
  );
}
