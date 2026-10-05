"use client";

import { useRef, useState } from "react";
import type { UserSummary } from "@/types/user";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { Composer } from "@/features/compose/components/composer";

type ComposeModalProps = {
  viewer: UserSummary;
  dismiss: RouteModalDismiss;
};

export function ComposeModal({ viewer, dismiss }: ComposeModalProps) {
  const closeRoute = useRouteModalClose(dismiss);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState(0);

  function close() {
    setDraft((current) => current + 1);
    closeRoute();
  }

  return (
    <Modal
      label="Compose post"
      placement="top"
      onClose={close}
      focusOnOpen={() => bodyRef.current?.querySelector("textarea")?.focus()}
      className="h-fit bg-elevated"
    >
      <ModalHeader
        onClose={close}
        className="bg-elevated/85"
        action={
          <button
            type="button"
            className="flex h-8 items-center rounded-full px-4 text-sm font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
          >
            Drafts
          </button>
        }
      />
      <div ref={bodyRef} className="overflow-y-auto">
        <Composer
          key={draft}
          viewer={viewer}
          variant="modal"
          onPublished={close}
        />
      </div>
    </Modal>
  );
}
