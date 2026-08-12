import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError, apiJson } from "@/lib/api";

const STEPS = ["Email", "Código", "Nueva contraseña"];

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [newPass, setNewPass] = React.useState("");
  const [confirmPass, setConfirmPass] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [notice, setNotice] = React.useState("");

  const reset = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setNewPass("");
    setConfirmPass("");
    setError("");
    setNotice("");
  };

  const handleClose = (v: boolean) => {
    onOpenChange(v);
    if (!v) reset();
  };

  const requestCode = async () => {
    await apiJson("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  };

  const handleStep1 = async () => {
    if (!email) {
      setError("Ingresá tu email corporativo.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await requestCode();
      setStep(2);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo enviar el código.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setNotice("");
    setSubmitting(true);
    try {
      await requestCode();
      setNotice("Código reenviado.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo reenviar el código.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2 = () => {
    if (!code) {
      setError("Ingresá el código que recibiste.");
      return;
    }
    setError("");
    setStep(3);
  };

  const handleReset = async () => {
    if (!newPass || newPass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await apiJson("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, code, newPassword: newPass }),
      });
      handleClose(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo restablecer la contraseña.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Restablecer contraseña</DialogTitle>
          <DialogDescription>
            Seguí los pasos para recuperar el acceso a tu cuenta.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-2 flex items-center gap-2">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                  i + 1 <= step ? "bg-[#1F7A4D] text-white" : "bg-stone-100 text-stone-400"
                }`}
              >
                {i + 1}
              </div>
              {i < STEPS.length - 1 && <div className="h-px flex-1 bg-stone-200" />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <Label htmlFor="reset-email">Email corporativo</Label>
            <Input
              id="reset-email"
              placeholder="nombre.apellido@farmacity.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <Label htmlFor="reset-code">Código de verificación</Label>
            <Input
              id="reset-code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button
              type="button"
              onClick={handleResend}
              disabled={submitting}
              className="text-xs text-[#1F7A4D] hover:underline"
            >
              Reenviar código
            </button>
            {notice && <p className="text-xs text-stone-500">{notice}</p>}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <Label htmlFor="new-pass">Nueva contraseña</Label>
            <Input
              id="new-pass"
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
            <Label htmlFor="confirm-pass">Confirmar contraseña</Label>
            <Input
              id="confirm-pass"
              type="password"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
            />
          </div>
        )}

        {error && (
          <p className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <DialogFooter>
          {step === 1 && (
            <Button
              className="w-full bg-[#1F7A4D] hover:bg-[#19653F]"
              disabled={submitting}
              onClick={handleStep1}
            >
              {submitting ? "Enviando..." : "Continuar"}
            </Button>
          )}
          {step === 2 && (
            <Button className="w-full bg-[#1F7A4D] hover:bg-[#19653F]" onClick={handleStep2}>
              Continuar
            </Button>
          )}
          {step === 3 && (
            <Button
              className="w-full bg-[#1F7A4D] hover:bg-[#19653F]"
              disabled={submitting}
              onClick={handleReset}
            >
              {submitting ? "Restableciendo..." : "Restablecer contraseña"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
