"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import type { List } from "@/types/list";
import { routes } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { ChevronRightIcon } from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import type { ListDraft } from "@/features/lists/types/list-draft";
import { deleteList, updateList } from "@/features/lists/api/list-mutations";
import { ListForm } from "@/features/lists/components/list-form";

type EditListModalProps = {
  list: List;
  dismiss: RouteModalDismiss;
};

function toDraft(list: List): ListDraft {
  return {
    name: list.name,
    description: list.description,
    private: list.private,
    bannerUrl: list.bannerUrl,
  };
}

function isSameDraft(a: ListDraft, b: ListDraft) {
  return (
    a.name === b.name &&
    a.description === b.description &&
    a.private === b.private &&
    a.bannerUrl === b.bannerUrl
  );
}

export function EditListModal({ list, dismiss }: EditListModalProps) {
  const router = useRouter();
  const close = useRouteModalClose(dismiss);
  const titleId = useId();
  const [draft, setDraft] = useState(() => toDraft(list));
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [pending, startTransition] = useTransition();
  const canSave =
    draft.name.trim() !== "" && !isSameDraft(draft, toDraft(list)) && !pending;

  function save() {
    startTransition(async () => {
      await updateList(list.id, draft);
      close();
    });
  }

  function remove() {
    startTransition(async () => {
      await deleteList(list.id);
      router.replace(routes.lists(list.owner.handle));
    });
  }

  return (
    <>
      <Modal
        onClose={() => {
          if (!pending && !confirmingDelete) close();
        }}
        labelledBy={titleId}
        size="fixed"
        className="overflow-y-auto"
      >
        <ModalHeader
          onClose={close}
          title="Edit List"
          titleId={titleId}
          action={
            <Button size="sm" disabled={!canSave} onClick={save}>
              Done
            </Button>
          }
        />
        <ListForm draft={draft} listId={list.id} onChange={setDraft} />
        <div className="border-t border-border">
          <Link
            href={routes.listMembers(list.id)}
            replace
            className="flex h-12 items-center justify-between px-4 text-base transition-colors duration-200 ease-[ease] hover:bg-white/3"
          >
            Manage members
            <ChevronRightIcon className="size-[18.75px] text-muted" />
          </Link>
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="flex h-[52px] w-full items-center justify-center px-4 text-base text-danger transition-colors duration-200 ease-[ease] hover:bg-danger/10"
          >
            Delete List
          </button>
        </div>
      </Modal>
      {confirmingDelete ? (
        <ConfirmSheet
          title="Delete List?"
          body="This can’t be undone and you’ll lose your List."
          confirmLabel="Delete"
          tone="danger"
          pending={pending}
          onConfirm={remove}
          onCancel={() => setConfirmingDelete(false)}
        />
      ) : null}
    </>
  );
}
