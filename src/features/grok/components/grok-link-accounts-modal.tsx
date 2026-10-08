"use client";

import { CloseIcon, GrokIcon, XLogoIcon } from "@/components/ui/icons";
import { Modal } from "@/components/ui/modal";
import { showToast } from "@/components/ui/toast";
import {
  grokLinks,
  grokUnavailableMessage,
} from "@/features/grok/config/grok";

const tile =
  "flex size-16 items-center justify-center rounded-2xl border border-border-strong bg-black text-white";

export function GrokLinkAccountsModal({ onClose }: { onClose: () => void }) {
  return (
    <Modal
      label="Link accounts"
      onClose={onClose}
      animated={false}
      restoreFocusOnUnmount
      className="relative h-auto min-h-0 w-[480px] max-w-[calc(100vw-32px)] items-center rounded-2xl border border-border px-6 pt-12 pb-5 max-[702px]:h-auto max-[702px]:w-[480px] max-[702px]:rounded-2xl"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-white/10 transition-colors duration-200 ease-[ease] hover:bg-white/20"
      >
        <CloseIcon className="size-3" />
      </button>
      <div aria-hidden className="relative h-[88px] w-[104px]">
        <span className={`${tile} absolute top-0 left-0`}>
          <XLogoIcon className="size-9" />
        </span>
        <span className={`${tile} absolute right-0 bottom-0`}>
          <GrokIcon className="h-9 w-[37px]" />
        </span>
      </div>
      <h2 className="mt-11 text-[23px] leading-7 font-semibold">
        One Grok, everywhere
      </h2>
      <p className="mt-4 text-center text-sm leading-5">
        Link your account to keep your chats in sync across X and Grok.
      </p>
      <button
        type="button"
        onClick={() => {
          showToast({ message: grokUnavailableMessage });
          onClose();
        }}
        className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-inverted text-lg font-medium text-inverted-foreground transition-colors duration-200 ease-[ease] hover:bg-inverted-hover"
      >
        Agree and continue
      </button>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 text-sm leading-5 underline transition-colors duration-200 ease-[ease] hover:text-muted"
      >
        Not now
      </button>
      <p className="mt-4 text-center text-[12px] leading-4 text-muted">
        By clicking Agree and continue, you agree to SpaceXAI&apos;s{" "}
        <a
          href={grokLinks.terms}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href={grokLinks.privacy}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          Privacy Policy
        </a>
        , and data sharing between X and SpaceXAI.
      </p>
    </Modal>
  );
}
