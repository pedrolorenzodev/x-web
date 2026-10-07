"use client";

import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { ChatPasscodeFlow } from "@/features/chat/components/chat-passcode-flow";

export function ChatShareModal({ dismiss }: { dismiss: RouteModalDismiss }) {
  const close = useRouteModalClose(dismiss);

  return (
    <Modal label="Share" size="fixed" onClose={close}>
      <ModalHeader onBack={close} title="Share" align="center" />
      <ChatPasscodeFlow initialStep="passcode" variant="modal" />
    </Modal>
  );
}
