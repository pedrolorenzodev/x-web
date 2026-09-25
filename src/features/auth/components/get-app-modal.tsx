import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { GET_APP_QR_URL } from "@/config/auth";
import { CloseIcon } from "@/components/ui/icons";
import { useModalDialog } from "@/features/auth/hooks/use-modal-dialog";

const EXIT_MS = 200;

type GetAppModalProps = {
  onClosed: () => void;
};

export function GetAppModal({ onClosed }: GetAppModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [closing, setClosing] = useState(false);

  function requestClose() {
    setClosing(true);
  }

  useModalDialog(dialogRef, {
    onEscape: requestClose,
    focusOnOpen: () => closeRef.current?.focus(),
  });

  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(onClosed, EXIT_MS);
    return () => clearTimeout(timer);
  }, [closing, onClosed]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal
      aria-labelledby={titleId}
      className={cn(
        "fixed inset-0 z-[1100] flex h-dvh w-full items-center justify-center outline-hidden transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] starting:scale-95 starting:opacity-0",
        closing && "scale-95 opacity-0",
      )}
    >
      <h2 id={titleId} className="sr-only">
        Get the app
      </h2>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden
        onClick={requestClose}
        className="absolute inset-0 bg-black"
      />
      <div className="absolute start-0 top-0 z-10 flex h-[60px] items-center px-3">
        <button
          ref={closeRef}
          type="button"
          aria-label="Close"
          onClick={requestClose}
          className="flex size-10 items-center justify-center rounded-full text-white"
        >
          <CloseIcon className="size-5" />
        </button>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="rounded-2xl bg-white/10 p-8">
          <Image
            src={GET_APP_QR_URL}
            alt="QR code to download the X app"
            width={420}
            height={420}
            className="size-[min(70vw,420px)] invert"
          />
        </div>
        <p className="text-[15px] leading-5 font-normal text-white">
          Get the app
        </p>
      </div>
    </div>
  );
}
