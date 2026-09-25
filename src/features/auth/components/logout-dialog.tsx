"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useTransition } from "react";
import { routes } from "@/config/routes";
import { XLogoIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { focusKeepingModality } from "@/utils/focus-with-modality";
import { logOut } from "@/features/auth/api/log-out";
import { useModalDialog } from "@/features/auth/hooks/use-modal-dialog";

type LogoutDialogProps = {
  dismiss: "back" | "home";
};

const button =
  "flex h-11 w-full items-center justify-center rounded-full border px-6 text-base font-bold outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] focus-visible:shadow-[0_0_0_2px_var(--color-button-focus-ring)]";

export function LogoutDialog({ dismiss }: LogoutDialogProps) {
  const router = useRouter();
  const headingId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const pressedMask = useRef(false);
  const dismissed = useRef(false);
  const [isLoggingOut, startLoggingOut] = useTransition();

  const returnFocus = useModalDialog(dialogRef, {
    onEscape: cancel,
    focusOnOpen: () => {
      if (confirmRef.current) focusKeepingModality(confirmRef.current);
    },
  });

  function cancel() {
    if (dismissed.current || isLoggingOut) return;
    dismissed.current = true;
    const target = returnFocus.current;
    if (target instanceof HTMLElement && target !== document.body) {
      focusKeepingModality(target);
    }
    if (dismiss === "back") router.back();
    else router.replace(routes.home);
  }

  function confirm() {
    startLoggingOut(async () => {
      await logOut();
      window.location.replace(routes.home);
    });
  }

  useEffect(() => {
    dismissed.current = false;
  }, []);

  return (
    <div
      onPointerDown={(event) => {
        pressedMask.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressedMask.current && event.target === event.currentTarget) {
          cancel();
        }
      }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-mask"
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal
        aria-labelledby={headingId}
        className="flex max-h-full w-[320px] max-w-[80vw] flex-col overflow-y-auto rounded-2xl bg-background p-8 max-[500px]:p-7"
      >
        <XLogoIcon className="mb-4 h-10 w-full shrink-0 text-foreground" />
        <h1 id={headingId} className="mb-2 text-xl font-bold">
          Log out of X?
        </h1>
        <p className="text-base text-muted">
          You can always log back in at any time. If you just want to switch
          accounts, you can do that by adding an existing account.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            ref={confirmRef}
            type="button"
            onClick={confirm}
            disabled={isLoggingOut}
            className={cn(
              button,
              "border-transparent bg-inverted text-inverted-foreground hover:bg-inverted-hover focus-visible:bg-inverted-hover active:bg-inverted-pressed",
            )}
          >
            Log out
          </button>
          <button
            type="button"
            onClick={cancel}
            className={cn(
              button,
              "border-outline text-inverted hover:bg-inverted/10 focus-visible:bg-inverted/10 active:bg-inverted/20",
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
