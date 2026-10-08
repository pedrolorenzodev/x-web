"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { Facepile } from "@/components/ui/facepile";
import { GrokIcon } from "@/components/ui/icons";
import { HoverCard } from "@/components/ui/hover-card";
import { RichText } from "@/components/ui/rich-text";
import { Spinner } from "@/components/ui/spinner";
import { UserBadges } from "@/components/ui/verified-badge";
import { FollowButton } from "@/components/user/follow-button";
import { useUserCardServices } from "@/components/user/user-card-context";
import { formatFollowedBy } from "@/utils/format-followed-by";
import { formatProfileCount } from "@/utils/format-profile-count";

const loaded = new Map<string, Promise<User | null>>();

type UserHoverCardProps = {
  handle: string;
  children: ReactNode;
};

export function UserHoverCard({ handle, children }: UserHoverCardProps) {
  const services = useUserCardServices();
  if (!services) return children;

  return (
    <HoverCard label={`@${handle}`} content={<UserCardBody handle={handle} />}>
      {children}
    </HoverCard>
  );
}

function UserCardBody({ handle }: { handle: string }) {
  const services = useUserCardServices();
  const key = handle.toLowerCase();
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    if (!services) return;
    let active = true;
    const request = loaded.get(key) ?? services.loadUserCard(handle);
    loaded.set(key, request);
    request.then((result) => {
      if (active) setUser(result);
    });
    return () => {
      active = false;
    };
  }, [handle, key, services]);

  if (user === undefined) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Spinner label="Loading profile" />
      </div>
    );
  }
  if (user === null || !services) return null;

  const profileHref = routes.profile(user.handle);
  const followedBy =
    user.id === services.viewerId ? null : formatFollowedBy(user.followedByPreview);

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between">
        <Link
          href={profileHref}
          className="rounded-full border-2 border-elevated"
        >
          <Avatar src={user.avatarUrl} alt={user.displayName} size="lg" />
        </Link>
        {user.id !== services.viewerId ? (
          <FollowButton
            userId={user.id}
            handle={user.handle}
            following={user.followedByViewer}
            toggleFollow={async (userId) => {
              await services.toggleFollow(userId);
              const fresh = services.loadUserCard(handle);
              loaded.set(key, fresh);
              setUser(await fresh);
            }}
            size="md"
          />
        ) : null}
      </div>
      <Link href={profileHref} className="mt-2 flex min-w-0 items-center">
        <span className="truncate text-lg font-bold hover:underline">
          {user.displayName}
        </span>
        <UserBadges user={user} />
      </Link>
      <Link href={profileHref} className="truncate text-base text-muted">
        @{user.handle}
      </Link>
      {user.bio ? (
        <p className="mt-3 text-base break-words whitespace-pre-wrap">
          <RichText text={user.bio} />
        </p>
      ) : null}
      <div className="mt-3 flex gap-5 text-sm">
        <Link href={`${profileHref}/following`} className="hover:underline">
          <span className="font-bold">
            {formatProfileCount(user.followingCount)}
          </span>{" "}
          <span className="text-muted">Following</span>
        </Link>
        <Link
          href={`${profileHref}/verified_followers`}
          className="hover:underline"
        >
          <span className="font-bold">
            {formatProfileCount(user.followersCount)}
          </span>{" "}
          <span className="text-muted">Followers</span>
        </Link>
      </div>
      {followedBy ? (
        <Link
          href={`${profileHref}/followers_you_follow`}
          className="mt-3 flex items-center gap-2 text-xs text-muted hover:underline"
        >
          <Facepile
            users={user.followedByPreview.users.slice(0, 3)}
            size={20}
            overlap={8}
          />
          <span className="line-clamp-2">{followedBy}</span>
        </Link>
      ) : null}
      <Link
        href={routes.grok}
        className="mt-4 flex h-9 items-center justify-center gap-1 rounded-full border border-outline px-4 text-base font-bold transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
      >
        <GrokIcon className="size-5" />
        Profile Summary
      </Link>
    </div>
  );
}
