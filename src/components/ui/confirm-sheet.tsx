"use client";

import { useId, useRef, type ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { focusKeepingModality } from "@/utils/focus-with-modality";

type ConfirmTone = "inverted" | "danger";

type ConfirmSheetProps = {
  title: string;
  body?: ReactNode;
  icon?: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: ConfirmTone;
  pending?: boolean;
  backdrop?: "mask" | "opaque-mask";
  onConfirm: () => void;
  onCancel: () => void;
};

const sheetButton =
  "flex h-11 w-full items-center justify-center rounded-full border px-6 text-base font-bold outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] focus-visible:shadow-[0_0_0_2px_var(--color-button-focus-ring)] disabled:opacity-50";

const confirmTones: Record<ConfirmTone, string> = {
  inverted:
    "border-transparent bg-inverted text-inverted-foreground hover:bg-inverted-hover focus-visible:bg-inverted-hover active:bg-inverted-pressed",
  danger:
    "border-transparent bg-danger text-white hover:bg-danger-hover focus-visible:bg-danger-hover active:bg-danger-pressed",
};

export function ConfirmSheet({
  title,
  body,
  icon,
  confirmLabel,
  cancelLabel = "Cancel",
  tone = "inverted",
  pending = false,
  backdrop = "mask",
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  const headingId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      role="alertdialog"
      labelledBy={headingId}
      size="confirm"
      backdrop={backdrop}
      restoreFocusOnUnmount
      onClose={() => {
        if (!pending) onCancel();
      }}
      focusOnOpen={() => {
        if (confirmRef.current) focusKeepingModality(confirmRef.current);
      }}
      className="overflow-y-auto"
    >
      {icon}
      <h1 id={headingId} className="mb-2 text-xl font-bold">
        {title}
      </h1>
      {body ? <div className="text-base text-muted">{body}</div> : null}
      <div className="mt-6 flex flex-col gap-3">
        <button
          ref={confirmRef}
          type="button"
          onClick={onConfirm}
          disabled={pending}
          className={cn(sheetButton, confirmTones[tone])}
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className={cn(
            sheetButton,
            "border-outline text-inverted hover:bg-inverted/10 focus-visible:bg-inverted/10 active:bg-inverted/20",
          )}
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
}
