"use client";

import { useId } from "react";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";

type ViewsModalProps = {
  dismiss: RouteModalDismiss;
};

export function ViewsModal({ dismiss }: ViewsModalProps) {
  const close = useRouteModalClose(dismiss);
  const titleId = useId();

  return (
    <Modal labelledBy={titleId} onClose={close} className="h-auto max-[702px]:h-auto">
      <ModalHeader onClose={close} />
      <div className="flex flex-col px-[100px] pb-12 max-[702px]:px-8">
        <h1 id={titleId} className="text-[31px] leading-9 font-extrabold">
          Views
        </h1>
        <p className="mt-2 text-base text-muted">
          Times this post was seen. To learn more, visit the{" "}
          <a
            href="https://help.x.com/en/using-x/view-counts"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            Help Center
          </a>
          .
        </p>
        <button
          type="button"
          onClick={close}
          className="mt-8 flex h-13 items-center justify-center rounded-full bg-inverted text-lg font-bold text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
        >
          Dismiss
        </button>
      </div>
    </Modal>
  );
}
