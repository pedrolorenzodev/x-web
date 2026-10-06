"use client";

import { startTransition, useId, useOptimistic } from "react";
import type { ToggleFollow, User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { UserCell } from "@/components/user/user-cell";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { removeListMember } from "@/features/lists/api/list-mutations";

type ListUsersModalProps = {
  listId: string;
  kind: "members" | "followers";
  users: User[];
  viewerId: string;
  canRemove: boolean;
  toggleFollow: ToggleFollow;
  dismiss: RouteModalDismiss;
};

const copy = {
  members: {
    title: "List members",
    empty: "People added to this List will show up here.",
  },
  followers: {
    title: "List followers",
    empty: "People who follow this List will show up here.",
  },
};

export function ListUsersModal({
  listId,
  kind,
  users,
  viewerId,
  canRemove,
  toggleFollow,
  dismiss,
}: ListUsersModalProps) {
  const close = useRouteModalClose(dismiss);
  const titleId = useId();
  const [visibleUsers, removeOptimistic] = useOptimistic(
    users,
    (current, userId: string) => current.filter((user) => user.id !== userId),
  );

  function remove(userId: string) {
    startTransition(async () => {
      removeOptimistic(userId);
      await removeListMember(listId, userId);
    });
  }

  return (
    <Modal onClose={close} labelledBy={titleId} size="fixed" className="overflow-y-auto">
      <ModalHeader onClose={close} title={copy[kind].title} titleId={titleId} />
      {visibleUsers.length ? (
        visibleUsers.map((user) => (
          <UserCell
            key={user.id}
            user={user}
            viewerId={viewerId}
            toggleFollow={toggleFollow}
            action={
              canRemove ? (
                <Button
                  size="sm"
                  variant="outline"
                  aria-label={`Remove @${user.handle}`}
                  onClick={() => remove(user.id)}
                  className="relative shrink-0"
                >
                  Remove
                </Button>
              ) : undefined
            }
          />
        ))
      ) : (
        <EmptyState
          title="This List is lonely"
          body={copy[kind].empty}
          className="max-w-[336px] px-0"
        />
      )}
    </Modal>
  );
}
