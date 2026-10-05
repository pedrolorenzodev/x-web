"use client";

import { useTransition } from "react";
import { routes } from "@/config/routes";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { XLogoIcon } from "@/components/ui/icons";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { logOut } from "@/features/auth/api/log-out";

type LogoutDialogProps = {
  dismiss: RouteModalDismiss;
};

export function LogoutDialog({ dismiss }: LogoutDialogProps) {
  const close = useRouteModalClose(dismiss);
  const [isLoggingOut, startLoggingOut] = useTransition();

  function confirm() {
    startLoggingOut(async () => {
      await logOut();
      window.location.replace(routes.home);
    });
  }

  return (
    <ConfirmSheet
      icon={<XLogoIcon className="mb-4 h-10 w-full shrink-0 text-foreground" />}
      title="Log out of X?"
      body="You can always log back in at any time. If you just want to switch accounts, you can do that by adding an existing account."
      confirmLabel="Log out"
      backdrop="opaque-mask"
      pending={isLoggingOut}
      onConfirm={confirm}
      onCancel={close}
    />
  );
}
