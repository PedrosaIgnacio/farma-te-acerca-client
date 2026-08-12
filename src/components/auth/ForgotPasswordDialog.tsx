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

const STEPS = ["Email", "Código", "Nueva contraseña"];

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const [step, setStep] = React.useState(1);

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setStep(1);
      }}
    >
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
            <Input id="reset-email" placeholder="nombre.apellido@farmacity.com" />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <Label htmlFor="reset-code">Código de verificación</Label>
            <Input id="reset-code" placeholder="123456" />
            <button className="text-xs text-[#1F7A4D] hover:underline">Reenviar código</button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <Label htmlFor="new-pass">Nueva contraseña</Label>
            <Input id="new-pass" type="password" />
            <Label htmlFor="confirm-pass">Confirmar contraseña</Label>
            <Input id="confirm-pass" type="password" />
          </div>
        )}

        <DialogFooter>
          {step < 3 ? (
            <Button className="w-full bg-[#1F7A4D] hover:bg-[#19653F]" onClick={() => setStep(step + 1)}>
              Continuar
            </Button>
          ) : (
            <Button
              className="w-full bg-[#1F7A4D] hover:bg-[#19653F]"
              onClick={() => onOpenChange(false)}
            >
              Restablecer contraseña
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
