"use client";

import { useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BackIcon, CloseIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { Tooltip } from "@/components/ui/tooltip";
import { useModalDialog } from "@/hooks/use-modal-dialog";
import { cn } from "@/lib/utils";

type ModalPlacement = "top" | "center";
type ModalSize = "sheet" | "fixed" | "confirm";
type ModalBackdrop = "scrim" | "mask" | "opaque-mask";

type ModalProps = {
  onClose: () => void;
  label?: string;
  labelledBy?: string;
  role?: "dialog" | "alertdialog";
  placement?: ModalPlacement;
  size?: ModalSize;
  backdrop?: ModalBackdrop;
  animated?: boolean;
  focusOnOpen?: () => void;
  restoreFocusOnUnmount?: boolean;
  className?: string;
  children: ReactNode;
};

const backdrops: Record<ModalBackdrop, string> = {
  scrim: "bg-scrim",
  mask: "bg-mask",
  "opaque-mask":
    "bg-background bg-[linear-gradient(var(--color-mask),var(--color-mask))]",
};

const sizes: Record<ModalSize, string> = {
  sheet:
    "w-[600px] max-h-[90vh] min-h-[200px] rounded-2xl max-[702px]:h-full max-[702px]:max-h-none max-[702px]:w-full max-[702px]:rounded-none",
  fixed:
    "w-[600px] h-[650px] max-h-[90vh] min-h-[400px] rounded-2xl max-[702px]:h-full max-[702px]:max-h-none max-[702px]:w-full max-[702px]:rounded-none",
  confirm: "w-[320px] max-w-[80vw] max-h-full rounded-2xl p-8 max-[500px]:p-7",
};

const subscribeToNothing = () => () => {};

export const MODAL_EVENT = "x-web:modal";

export function Modal(props: ModalProps) {
  const isClient = useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false,
  );
  if (!isClient) return null;
  return createPortal(<ModalContent {...props} />, document.body);
}

function ModalContent({
  onClose,
  label,
  labelledBy,
  role = "dialog",
  placement = "center",
  size = "sheet",
  backdrop = placement === "top" ? "scrim" : "mask",
  animated = size !== "confirm",
  focusOnOpen,
  restoreFocusOnUnmount = false,
  className,
  children,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const pressedMask = useRef(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent(MODAL_EVENT, { detail: "open" }));
    return () => {
      window.dispatchEvent(new CustomEvent(MODAL_EVENT, { detail: "close" }));
    };
  }, []);

  useModalDialog(dialogRef, {
    onEscape: onClose,
    focusOnOpen,
    restoreFocusOnUnmount,
  });

  return (
    <div
      onPointerDown={(event) => {
        pressedMask.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (pressedMask.current && event.target === event.currentTarget) {
          onClose();
        }
      }}
      className={cn(
        "fixed inset-0 z-40 flex justify-center",
        placement === "top"
          ? "items-start pt-[45px] max-[702px]:pt-0"
          : "items-center",
        animated && "t-modal-mask",
        backdrops[backdrop],
      )}
    >
      <div
        ref={dialogRef}
        role={role}
        aria-modal
        aria-label={label}
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={cn(
          "flex flex-col overflow-hidden bg-background outline-none",
          animated && "t-modal",
          sizes[size],
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}

type ModalHeaderProps = {
  onClose?: () => void;
  onBack?: () => void;
  title?: ReactNode;
  titleId?: string;
  align?: "start" | "center";
  action?: ReactNode;
  className?: string;
};

export function ModalHeader({
  onClose,
  onBack,
  title,
  titleId,
  align = "start",
  action,
  className,
}: ModalHeaderProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-1 flex h-[53px] shrink-0 items-center bg-background/85 px-4 backdrop-blur-[12px]",
        className,
      )}
    >
      <div className="min-w-14">
        {onBack ? (
          <Tooltip label="Back">
            <IconButton
              label="Back"
              tone="plain"
              onClick={onBack}
              className="-ml-2 size-9"
            >
              <BackIcon className="size-5" />
            </IconButton>
          </Tooltip>
        ) : onClose ? (
          <Tooltip label="Close">
            <IconButton
              label="Close"
              tone="plain"
              onClick={onClose}
              className="-ml-2 size-9"
            >
              <CloseIcon className="size-5" />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      {title ? (
        <h2
          id={titleId}
          className={cn(
            "min-w-0 flex-1 truncate text-xl font-bold",
            align === "center" && "text-center text-lg",
          )}
        >
          {title}
        </h2>
      ) : (
        <div className="flex-1" />
      )}
      <div
        className={cn(
          "flex min-w-14 items-center justify-end",
          align === "start" && !action && "min-w-0",
        )}
      >
        {action}
      </div>
    </div>
  );
}
