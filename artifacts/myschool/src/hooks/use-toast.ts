import * as React from "react";
import { toast as sonner, type ExternalToast } from "sonner";

import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Toast = Omit<ToasterToast, "id">;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function buildOptions(props: Toast): ExternalToast {
  const opts: ExternalToast = { duration: 4000 };
  if (props.description) {
    opts.description = props.description as string;
  }
  if (props.action && React.isValidElement(props.action)) {
    const actionProps = props.action.props as { altText?: string; children?: React.ReactNode; onClick?: () => void };
    opts.action = {
      label: typeof actionProps.children === "string" ? actionProps.children : (actionProps.altText ?? "Action"),
      onClick: actionProps.onClick ?? (() => {}),
    };
  }
  return opts;
}

function showSonner(id: string, props: Toast) {
  const opts = buildOptions(props);
  if (props.variant === "destructive") {
    return sonner.error(String(props.title ?? ""), { id, ...opts });
  }
  return sonner(String(props.title ?? ""), { id, ...opts });
}

function toast({ ...props }: Toast) {
  const id = genId();
  showSonner(id, props);

  return {
    id,
    dismiss: () => sonner.dismiss(id),
    update: (updated: Partial<ToasterToast>) =>
      showSonner(id, { ...props, ...updated } as Toast),
  };
}

function useToast() {
  const [toasts] = React.useState<ToasterToast[]>([]);

  return {
    toasts,
    toast,
    dismiss: (toastId?: string) => sonner.dismiss(toastId),
  };
}

export { useToast, toast };
export type { ToasterToast, Toast };
