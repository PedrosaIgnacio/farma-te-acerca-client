import * as React from "react";
import { MapPin } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

import { ForgotPasswordDialog } from "@/components/auth/ForgotPasswordDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_HOME } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";
import { ApiError } from "@/lib/api";

export function LoginPage() {
  const { session, login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [forgotOpen, setForgotOpen] = React.useState(false);

  if (session) {
    return <Navigate to={ROLE_HOME[session.role]} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !pass) {
      setError("Ingresá tu usuario y contraseña.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const next = await login(username, pass);
      navigate(ROLE_HOME[next.role], { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
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
                  placeholder="Ej: 10001"
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
              </div>

              {error && (
                <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#1F7A4D] hover:bg-[#19653F]"
              >
                {submitting ? "Ingresando..." : "Iniciar sesión"}
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
                onClick={() =>
                  setError("Inicio de sesión con Microsoft 365 no disponible todavía.")
                }
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
