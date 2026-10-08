"use client";

import { useState, type ReactNode } from "react";
import {
  CommunitiesFillIcon,
  LikeActiveIcon,
  SparkleIcon,
} from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { dismissCommunitiesWelcome } from "@/features/communities/api/community-mutations";

function WelcomeRow({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-5">
      <span className="flex size-6 shrink-0 items-center justify-center [&>svg]:size-6">
        {icon}
      </span>
      <div>
        <p className="text-base font-bold">{title}</p>
        <p className="mt-1 text-base text-muted">{children}</p>
      </div>
    </div>
  );
}

export function CommunitiesWelcome() {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  function dismiss() {
    setOpen(false);
    void dismissCommunitiesWelcome();
  }

  return (
    <Modal
      label="Welcome to Communities"
      onClose={dismiss}
      className="h-auto max-h-[90vh] min-h-0"
    >
      <ModalHeader onClose={dismiss} className="bg-transparent" />
      <div className="mx-auto flex w-full max-w-[400px] flex-col overflow-y-auto pb-20 max-[702px]:max-w-none max-[702px]:px-8 max-[702px]:pb-12">
        <h1 className="mt-8 text-[31px] leading-9 font-extrabold whitespace-nowrap max-[702px]:whitespace-normal">
          Welcome to Communities
        </h1>
        <p className="mt-1 text-base text-muted">
          Communities are moderated discussion groups where people on X can
          connect and share.
        </p>
        <div className="mt-11 flex flex-col gap-6">
          <WelcomeRow icon={<SparkleIcon />} title="Meet others with your interests">
            Join Communities to connect with people who share your interests.
          </WelcomeRow>
          <WelcomeRow icon={<CommunitiesFillIcon />} title="Post directly to a Community">
            Your posts are shared with Community members and your followers.
          </WelcomeRow>
          <WelcomeRow icon={<LikeActiveIcon />} title="Get backup when you need it">
            Admins and moderators help manage Communities and keep
            conversations on track.
          </WelcomeRow>
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="mt-11 flex h-[52px] w-full items-center justify-center rounded-full bg-inverted text-[17px] font-bold text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
        >
          Check it out
        </button>
      </div>
    </Modal>
  );
}
