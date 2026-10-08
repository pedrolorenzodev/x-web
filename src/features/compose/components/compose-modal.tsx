"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import type { ComposeSetup } from "@/features/compose/types/compose-target";
import { useComposer } from "@/features/compose/hooks/use-composer";
import { saveDraft } from "@/features/compose/api/save-draft";
import { ComposerForm } from "@/features/compose/components/composer-form";
import { ReplyParent } from "@/features/compose/components/reply-parent";
import {
  clearHandedOffComposer,
  readHandedOffComposer,
} from "@/features/compose/utils/compose-handoff";
import {
  snapshotFromDraft,
  snapshotWithText,
  toNewPosts,
} from "@/features/compose/utils/composer-snapshot";
import { hasContent } from "@/features/compose/utils/composer-status";

type ComposeModalProps = {
  viewer: UserSummary;
  dismiss: RouteModalDismiss;
  setup: ComposeSetup;
};

type PendingExit = "close" | "drafts";

export function ComposeModal({ viewer, dismiss, setup }: ComposeModalProps) {
  const router = useRouter();
  const closeRoute = useRouteModalClose(dismiss);
  const bodyRef = useRef<HTMLDivElement>(null);
  const { target, draft, text } = setup;
  const composer = useComposer(
    () =>
      readHandedOffComposer() ??
      (draft ? snapshotFromDraft(draft) : snapshotWithText(text)),
  );
  const [pendingExit, setPendingExit] = useState<PendingExit | null>(null);
  const [saving, startSaving] = useTransition();

  useEffect(() => {
    clearHandedOffComposer();
  }, []);

  function leave(exit: PendingExit) {
    setPendingExit(null);
    if (exit === "close") closeRoute();
    else router.push(routes.composeDrafts);
  }

  function requestExit(exit: PendingExit) {
    if (hasContent(composer.snapshot)) setPendingExit(exit);
    else leave(exit);
  }

  function saveAndLeave(exit: PendingExit) {
    const { snapshot } = composer;
    startSaving(async () => {
      await saveDraft({
        id: snapshot.draftId,
        posts: toNewPosts(snapshot.posts),
        replySettings: snapshot.replySettings,
        replyToId: target?.kind === "reply" ? target.tweet.id : null,
        quotedId: target?.kind === "quote" ? target.tweet.id : null,
        scheduledAt: snapshot.scheduledAt,
      });
      leave(exit);
    });
  }

  return (
    <Modal
      label="Compose post"
      placement="top"
      onClose={() => requestExit("close")}
      focusOnOpen={() => {
        const textareas = bodyRef.current?.querySelectorAll("textarea");
        const index = composer.snapshot.activeIndex;
        textareas?.[index]?.focus();
      }}
      className="h-fit bg-elevated"
    >
      <ModalHeader
        onClose={() => requestExit("close")}
        className="bg-elevated/85"
        action={
          <button
            type="button"
            onClick={() => requestExit("drafts")}
            className="flex h-8 items-center rounded-full px-4 text-sm font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
          >
            Drafts
          </button>
        }
      />
      <div ref={bodyRef} className="overflow-y-auto">
        {target?.kind === "reply" ? <ReplyParent tweet={target.tweet} /> : null}
        <ComposerForm
          viewer={viewer}
          composer={composer}
          variant="modal"
          target={target}
          onAddPost={composer.addPost}
          onPublished={closeRoute}
        />
      </div>

      {pendingExit ? (
        <ConfirmSheet
          title="Save post?"
          body="You can save this to send later from your drafts."
          confirmLabel="Save"
          cancelLabel="Discard"
          backdrop="mask"
          pending={saving}
          onConfirm={() => saveAndLeave(pendingExit)}
          onCancel={() => leave(pendingExit)}
          onDismiss={() => setPendingExit(null)}
        />
      ) : null}
    </Modal>
  );
}
