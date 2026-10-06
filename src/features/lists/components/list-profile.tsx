import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { List } from "@/types/list";
import { routes } from "@/config/routes";
import { formatProfileCount } from "@/utils/format-profile-count";
import { buttonStyles } from "@/components/ui/button";
import { LockIcon } from "@/components/ui/icons";
import { UserBadges } from "@/components/ui/verified-badge";
import { ListBanner } from "@/components/list/list-cover";
import { ListFollowButton } from "@/features/lists/components/list-follow-button";

type ListProfileProps = {
  list: List;
  isOwner: boolean;
};

function CountLink({ href, count, label }: { href: string; count: number; label: string }) {
  return (
    <Link href={href} className="text-base hover:underline">
      <span className="font-bold text-foreground">{formatProfileCount(count)}</span>{" "}
      <span className="text-muted">{label}</span>
    </Link>
  );
}

export function ListProfile({ list, isOwner }: ListProfileProps) {
  let action: ReactNode = null;
  if (isOwner) {
    action = (
      <Link
        href={routes.listInfo(list.id)}
        className={buttonStyles({ variant: "outline", size: "md" })}
      >
        Edit List
      </Link>
    );
  } else if (!list.private) {
    action = (
      <ListFollowButton
        listId={list.id}
        following={list.followedByViewer}
        variant="pill"
      />
    );
  }

  return (
    <div className="border-b border-border">
      <ListBanner listId={list.id} bannerUrl={list.bannerUrl} />
      <div className="flex flex-col items-center px-4 pt-3 pb-4 text-center">
        <h1 className="flex items-center text-xl font-bold break-words">
          {list.name}
          {list.private ? (
            <LockIcon
              role="img"
              aria-hidden={false}
              aria-label="Private List"
              className="ml-0.5 size-5 shrink-0"
            />
          ) : null}
        </h1>
        {list.description ? (
          <p className="mt-3 max-w-[574px] text-base break-words">
            {list.description}
          </p>
        ) : null}
        <Link
          href={routes.profile(list.owner.handle)}
          className="group mt-3 flex min-w-0 items-center gap-1 text-base"
        >
          <Image
            src={list.owner.avatarUrl}
            alt=""
            width={20}
            height={20}
            className="size-5 shrink-0 rounded-full object-cover"
          />
          <span className="truncate font-bold group-hover:underline">
            {list.owner.displayName}
          </span>
          <UserBadges user={list.owner} />
          <span className="truncate text-muted">@{list.owner.handle}</span>
        </Link>
        <div className="mt-3 flex gap-5">
          <CountLink
            href={routes.listMembers(list.id)}
            count={list.memberCount}
            label={list.memberCount === 1 ? "Member" : "Members"}
          />
          <CountLink
            href={routes.listFollowers(list.id)}
            count={list.followerCount}
            label={list.followerCount === 1 ? "Follower" : "Followers"}
          />
        </div>
        {action ? <div className="mt-4">{action}</div> : null}
      </div>
    </div>
  );
}
