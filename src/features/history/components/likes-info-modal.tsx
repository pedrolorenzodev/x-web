"use client";

import { Modal, ModalHeader } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export function LikesInfoModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} labelledBy="likes-info-title" className="h-auto">
      <ModalHeader onClose={onClose} />
      <div className="mx-auto flex w-full max-w-[380px] flex-col px-8 pt-[30px] pb-20">
        <h2
          id="likes-info-title"
          className="text-[31px] leading-9 font-extrabold"
        >
          Likes
        </h2>
        <p className="mt-1 text-base text-muted">
          Your likes are private. Only you can see them.
        </p>
        <Button size="lg" onClick={onClose} className="mt-8 w-full text-base">
          Got it
        </Button>
      </div>
    </Modal>
  );
}
