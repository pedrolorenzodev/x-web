"use client";

import {
  NoticeModal,
  noticePrimaryButton,
} from "@/components/tweet/notice-modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";

type ViewsModalProps = {
  dismiss: RouteModalDismiss;
};

export function ViewsModal({ dismiss }: ViewsModalProps) {
  const close = useRouteModalClose(dismiss);

  return (
    <NoticeModal
      title="Views"
      onClose={close}
      body={
        <>
          Times this post was seen. To learn more, visit the{" "}
          <a
            href="https://help.x.com/en/using-x/view-counts"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground underline"
          >
            Help Center
          </a>
          .
        </>
      }
    >
      <button type="button" onClick={close} className={noticePrimaryButton}>
        Dismiss
      </button>
    </NoticeModal>
  );
}
