"use client";

import { useRef, useState } from "react";
import type { UserSummary } from "@/types/user";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import type { ComposeTarget } from "@/features/compose/types/compose-target";
import { Composer } from "@/features/compose/components/composer";
import { ReplyParent } from "@/features/compose/components/reply-parent";

type ComposeModalProps = {
  viewer: UserSummary;
  dismiss: RouteModalDismiss;
  target?: ComposeTarget | null;
};

export function ComposeModal({
  viewer,
  dismiss,
  target = null,
}: ComposeModalProps) {
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
        {target?.kind === "reply" ? <ReplyParent tweet={target.tweet} /> : null}
        <Composer
          key={draft}
          viewer={viewer}
          variant="modal"
          target={target}
          onPublished={close}
        />
      </div>
    </Modal>
  );
}
