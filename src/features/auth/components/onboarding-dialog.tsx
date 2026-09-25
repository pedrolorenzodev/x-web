import { useRef, type ReactNode } from "react";
import { useModalDialog } from "@/features/auth/hooks/use-modal-dialog";

type OnboardingDialogProps = {
  label: string;
  onDismiss: () => void;
  children: ReactNode;
};

export function OnboardingDialog({
  label,
  onDismiss,
  children,
}: OnboardingDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useModalDialog(dialogRef, {
    onEscape: onDismiss,
    restoreFocusOnUnmount: true,
  });

  return (
    <>
      <div
        aria-hidden
        onClick={onDismiss}
        className="fixed inset-0 z-50 bg-auth-backdrop backdrop-blur-[4px]"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal
        aria-label={label}
        tabIndex={-1}
        className="fixed inset-0 z-50 m-auto h-fit w-[700px] max-w-full overflow-hidden rounded-3xl border border-white/15 bg-elevated shadow-auth-card outline-hidden max-narrow:h-auto max-narrow:rounded-none max-narrow:border-0 max-narrow:bg-black max-narrow:shadow-none"
      >
        <div className="h-[664px] max-h-[calc(100dvh-32px)] w-full max-narrow:h-full max-narrow:max-h-none">
          {children}
        </div>
      </div>
    </>
  );
}
