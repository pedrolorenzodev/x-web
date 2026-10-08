"use client";

import Link from "next/link";
import { routes } from "@/config/routes";
import {
  NoticeModal,
  noticeOutlineButton,
  noticePrimaryButton,
} from "@/components/tweet/notice-modal";

export function BookmarkFoldersModal({ onClose }: { onClose: () => void }) {
  return (
    <NoticeModal
      title="Unlock bookmark folders with X Premium"
      body="Only X Premium subscribers have access to bookmark folders. Upgrade to continue."
      onClose={onClose}
    >
      <Link href={routes.premium} onClick={onClose} className={noticePrimaryButton}>
        Upgrade
      </Link>
      <button type="button" onClick={onClose} className={noticeOutlineButton}>
        Maybe later
      </button>
    </NoticeModal>
  );
}
