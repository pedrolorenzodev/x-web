"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Page } from "@/types/pagination";
import type { ToggleFollow, User } from "@/types/user";
import { SpinnerRow } from "@/components/ui/spinner";
import { UserCell } from "@/components/user/user-cell";
import { getConnectUsers } from "@/features/connect/api/get-connect-users";
import { SubscribeLink } from "@/features/connect/components/subscribe-link";
import type { ConnectTab } from "@/features/connect/types/connect";

type ConnectPeopleListProps = {
  tab: ConnectTab;
  excludeId: string | null;
  firstPage: Page<User>;
  viewerId: string;
  toggleFollow: ToggleFollow;
};

function withFollowToggled(user: User): User {
  const following = !user.followedByViewer;

  return {
    ...user,
    followedByViewer: following,
    followersCount: user.followersCount + (following ? 1 : -1),
  };
}

export function ConnectPeopleList({
  tab,
  excludeId,
  firstPage,
  viewerId,
  toggleFollow,
}: ConnectPeopleListProps) {
  const [page, setPage] = useState(firstPage);
  const loading = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const cursor = useRef(page.nextCursor);

  useEffect(() => {
    cursor.current = page.nextCursor;
  });

  const loadMore = useCallback(async () => {
    if (loading.current || !cursor.current) return;

    loading.current = true;
    const next = await getConnectUsers(tab, excludeId, cursor.current);
    setPage((current) => {
      const known = new Set(current.items.map((user) => user.id));
      return {
        items: [
          ...current.items,
          ...next.items.filter((user) => !known.has(user.id)),
        ],
        nextCursor: next.nextCursor,
      };
    });
    loading.current = false;
  }, [tab, excludeId]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !page.nextCursor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { rootMargin: "0px 0px 1000px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [page.nextCursor, loadMore]);

  async function toggleListedFollow(userId: string) {
    setPage((current) => ({
      ...current,
      items: current.items.map((user) =>
        user.id === userId ? withFollowToggled(user) : user,
      ),
    }));
    await toggleFollow(userId);
  }

  return (
    <>
      {page.items.map((user) => (
        <UserCell
          key={user.id}
          user={user}
          viewerId={viewerId}
          toggleFollow={toggleListedFollow}
          action={
            tab === "creators" ? <SubscribeLink handle={user.handle} /> : undefined
          }
        />
      ))}
      <div ref={sentinel}>
        {page.nextCursor ? <SpinnerRow label="Loading suggestions" /> : null}
      </div>
    </>
  );
}
