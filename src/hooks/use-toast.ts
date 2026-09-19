import * as React from "react";

const DEFAULT_DURATION = 4000;

export interface ToasterToast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

let toasts: ToasterToast[] = [];
const listeners: Array<(toasts: ToasterToast[]) => void> = [];

function emit() {
  listeners.forEach((listener) => listener(toasts));
}

function dismiss(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

function toast({ duration = DEFAULT_DURATION, ...props }: Omit<ToasterToast, "id">) {
  const id = crypto.randomUUID();
  toasts = [...toasts, { id, duration, ...props }];
  emit();
  if (duration > 0) {
    setTimeout(() => dismiss(id), duration);
  }
  return id;
}

function useToast() {
  const [state, setState] = React.useState(toasts);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return { toasts: state, toast, dismiss };
}

export { useToast, toast };
