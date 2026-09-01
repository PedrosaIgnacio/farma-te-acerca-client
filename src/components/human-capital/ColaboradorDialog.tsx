import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ROLE_LABEL } from "@/config/navigation";
import { useBranches } from "@/hooks/useBranches";
import { ApiError, apiJson } from "@/lib/api";
import type { CreateHcUserResponse, HcUser, Role } from "@/types";

const ROLES: Role[] = ["collaborator", "hc", "dt"];

interface ColaboradorDialogProps {
  open: boolean;
  user: HcUser | null; // null = create
  onOpenChange: (open: boolean) => void;
  onCreated: (created: HcUser) => void;
  onUpdated: (updated: HcUser) => void;
}

export function ColaboradorDialog({ open, user, onOpenChange, onCreated, onUpdated }: ColaboradorDialogProps) {
  const { branches } = useBranches();
  const [legajo, setLegajo] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [rol, setRol] = React.useState<Role>("collaborator");
  const [sucursalId, setSucursalId] = React.useState<string | null>(null);
  const [activo, setActivo] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [temporaryPassword, setTemporaryPassword] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setLegajo(user?.legajo ?? "");
    setNombre(user?.nombre ?? "");
    setEmail(user?.email ?? "");
    setTelefono(user?.telefono ?? "");
    setRol(user?.rol ?? "collaborator");
    setSucursalId(user?.currentBranchId != null ? String(user.currentBranchId) : null);
    setActivo(user?.activo ?? true);
    setError(null);
    setTemporaryPassword(null);
    setCopied(false);
  }, [user, open]);

  const handleSubmit = async () => {
    if (!legajo.trim() || !nombre.trim() || !email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      if (user) {
        const updated = await apiJson<HcUser>(`/hc/users/${user.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            nombre: nombre.trim(),
            email: email.trim(),
            telefono: telefono.trim() || undefined,
            rol,
            sucursalId: sucursalId ? Number(sucursalId) : undefined,
            activo,
          }),
        });
        onUpdated(updated);
        onOpenChange(false);
      } else {
        const created = await apiJson<CreateHcUserResponse>("/hc/users", {
          method: "POST",
          body: JSON.stringify({
            legajo: legajo.trim(),
            nombre: nombre.trim(),
            email: email.trim(),
            telefono: telefono.trim() || undefined,
            rol,
            sucursalId: sucursalId ? Number(sucursalId) : undefined,
          }),
        });
        onCreated(created);
        // Don't close yet — the temporary password only appears once and
        // has to be shown to HC before this dialog can go away.
        setTemporaryPassword(created.temporaryPassword);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo guardar el colaborador.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPassword = async () => {
    if (!temporaryPassword) return;
    await navigator.clipboard.writeText(temporaryPassword);
    setCopied(true);
  };

  if (temporaryPassword) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Colaborador creado</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              Contraseña temporal para <strong>{nombre}</strong> — compartísela de forma segura, no va a
              volver a mostrarse.
            </p>
            <div className="flex items-center gap-2 rounded-md border border-stone-200 bg-stone-50 px-3 py-2">
              <code className="flex-1 text-sm font-medium text-stone-800">{temporaryPassword}</code>
              <Button variant="outline" size="sm" onClick={handleCopyPassword}>
                {copied ? "Copiada" : "Copiar"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-[#1F7A4D] hover:bg-[#19653F]" onClick={() => onOpenChange(false)}>
              Listo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Editar colaborador" : "Nuevo colaborador"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Legajo</Label>
            <Input value={legajo} onChange={(e) => setLegajo(e.target.value)} disabled={!!user} placeholder="10001" />
          </div>

          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre y apellido" />
          </div>

          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="persona@farmacity.com" />
          </div>

          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Opcional" />
          </div>

          <div className="space-y-1.5">
            <Label>Rol</Label>
            <Select value={rol} onValueChange={(v) => setRol(v as Role)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {ROLE_LABEL[r]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Sucursal</Label>
            <Select value={sucursalId ?? undefined} onValueChange={setSucursalId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sin sucursal asignada" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((b) => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {user && (
            <div className="space-y-1.5">
              <Label>Estado</Label>
              <Select value={activo ? "activo" : "inactivo"} onValueChange={(v) => setActivo(v === "activo")}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activo">Activo</SelectItem>
                  <SelectItem value="inactivo">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            className="bg-[#1F7A4D] hover:bg-[#19653F]"
            onClick={handleSubmit}
            disabled={submitting || !legajo.trim() || !nombre.trim() || !email.trim()}
          >
            {submitting ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
