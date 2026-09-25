"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { IconButton } from "@/components/ui/icon-button";
import { CloseIcon } from "@/components/ui/icons";
import { Composer } from "@/features/compose/components/composer";

type ComposeModalProps = {
  viewer: UserSummary;
  dismiss: "back" | "home";
};

export function ComposeModal({ viewer, dismiss }: ComposeModalProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState(0);

  const close = useCallback(() => {
    setDraft((current) => current + 1);
    if (dismiss === "back") router.back();
    else router.replace(routes.home);
  }, [dismiss, router]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden";
    dialogRef.current?.querySelector("textarea")?.focus();
    window.addEventListener("keydown", onKeyDown);

    return () => {
      root.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close]);

  return (
    <div
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="fixed inset-0 z-20 flex justify-center bg-scrim"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal
        aria-label="Compose post"
        className="mt-[5vh] h-fit w-[600px] rounded-2xl bg-elevated"
      >
        <div className="flex h-[53px] items-center px-4">
          <IconButton
            label="Close"
            tone="plain"
            onClick={close}
            className="-ml-2 size-9"
          >
            <CloseIcon className="size-5" />
          </IconButton>
          <button
            type="button"
            className="ml-auto flex h-8 items-center rounded-full px-4 text-sm font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
          >
            Drafts
          </button>
        </div>
        <Composer
          key={draft}
          viewer={viewer}
          variant="modal"
          onPublished={close}
        />
      </div>
    </div>
  );
}
