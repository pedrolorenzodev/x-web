"use client";

import Link from "next/link";
import { useId, useState, useTransition } from "react";
import { routes } from "@/config/routes";
import { Button, buttonStyles } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { LockIcon } from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { ListThumbnail } from "@/components/list/list-cover";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import type { PickableList } from "@/features/lists/types/pickable-list";
import { saveUserLists } from "@/features/lists/api/list-mutations";

type PickListModalProps = {
  userId: string;
  lists: PickableList[];
  dismiss: RouteModalDismiss;
};

function memberListIds(lists: PickableList[]) {
  return lists.filter((entry) => entry.isMember).map((entry) => entry.list.id);
}

export function PickListModal({ userId, lists, dismiss }: PickListModalProps) {
  const close = useRouteModalClose(dismiss);
  const titleId = useId();
  const [selected, setSelected] = useState(() => new Set(memberListIds(lists)));
  const [pending, startTransition] = useTransition();
  const initial = memberListIds(lists);
  const changed =
    initial.length !== selected.size || initial.some((id) => !selected.has(id));

  function toggle(listId: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(listId)) next.delete(listId);
      else next.add(listId);
      return next;
    });
  }

  function save() {
    startTransition(async () => {
      await saveUserLists(userId, [...selected]);
      close();
    });
  }

  return (
    <Modal
      onClose={() => {
        if (!pending) close();
      }}
      labelledBy={titleId}
      size="fixed"
      className="overflow-y-auto"
    >
      <ModalHeader
        onClose={close}
        title="Pick a List"
        titleId={titleId}
        action={
          <Button size="sm" disabled={!changed || pending} onClick={save}>
            Save
          </Button>
        }
      />
      {lists.length ? (
        lists.map(({ list }) => {
          const checked = selected.has(list.id);
          return (
            <label
              key={list.id}
              className="flex h-[72px] cursor-pointer items-center gap-4 px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3"
            >
              <ListThumbnail listId={list.id} bannerUrl={list.bannerUrl} />
              <span className="flex min-w-0 grow flex-col">
                <span className="flex min-w-0 items-center">
                  <span className="truncate text-base font-bold">{list.name}</span>
                  {list.private ? (
                    <LockIcon
                      role="img"
                      aria-hidden={false}
                      aria-label="Private List"
                      className="ml-0.5 size-[18.75px] shrink-0"
                    />
                  ) : null}
                </span>
                <span className="truncate text-xs text-muted">
                  {list.memberCount} {list.memberCount === 1 ? "member" : "members"}
                </span>
              </span>
              <Checkbox
                checked={checked}
                aria-label={list.name}
                onChange={() => toggle(list.id)}
                className="-mr-2"
              />
            </label>
          );
        })
      ) : (
        <EmptyState
          title="Your Lists are empty"
          body="You’ll need to create a List before adding someone."
          className="max-w-[336px] px-0"
          action={
            <Link
              href={routes.listCreate}
              className={buttonStyles({ variant: "accent", size: "lg" })}
            >
              Create a List
            </Link>
          }
        />
      )}
    </Modal>
  );
}
