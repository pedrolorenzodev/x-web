"use client";

import { useId, type ReactNode } from "react";
import { Modal, ModalHeader } from "@/components/ui/modal";

export const noticePrimaryButton =
  "flex h-13 items-center justify-center rounded-full bg-inverted text-lg font-bold text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover";

export const noticeOutlineButton =
  "flex h-13 items-center justify-center rounded-full border border-outline text-lg font-bold text-foreground transition-colors duration-200 ease-[ease] hover:bg-foreground/10";

type NoticeModalProps = {
  title: string;
  body: ReactNode;
  onClose: () => void;
  children: ReactNode;
};

export function NoticeModal({ title, body, onClose, children }: NoticeModalProps) {
  const titleId = useId();

  return (
    <Modal
      labelledBy={titleId}
      onClose={onClose}
      className="h-auto max-[702px]:h-auto"
    >
      <ModalHeader onClose={onClose} />
      <div className="flex flex-col px-[100px] pt-8 pb-20 max-[702px]:px-8">
        <h1 id={titleId} className="text-[26px] leading-8 font-extrabold">
          {title}
        </h1>
        <p className="mt-2 text-base text-muted">{body}</p>
        <div className="mt-8 flex flex-col gap-4">{children}</div>
      </div>
    </Modal>
  );
}
