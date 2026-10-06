import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { List } from "@/types/list";
import { routes } from "@/config/routes";
import { formatCount } from "@/utils/format-count";
import { Facepile } from "@/components/ui/facepile";
import { LockIcon } from "@/components/ui/icons";
import { UserBadges } from "@/components/ui/verified-badge";
import { ListThumbnail } from "@/components/list/list-cover";

type ListCellProps = {
  list: List;
  social: "followers" | "owner";
  showMemberCount?: boolean;
  action?: ReactNode;
};

function FollowersLine({ list }: { list: List }) {
  const [first] = list.followersPreview;
  const count = `${formatCount(list.followerCount)} ${list.followerCount === 1 ? "follower" : "followers"}`;

  return (
    <span className="flex min-w-0 items-center gap-1 text-xs text-muted">
      {list.followersPreview.length ? (
        <Facepile users={list.followersPreview.slice(0, 3)} size={24} overlap={12} />
      ) : null}
      <span className="truncate">
        {first ? `${count} including @${first.handle}` : count}
      </span>
    </span>
  );
}

function OwnerLine({ list }: { list: List }) {
  return (
    <span className="flex min-w-0 items-center gap-1 text-xs">
      <Image
        src={list.owner.avatarUrl}
        alt=""
        width={16}
        height={16}
        className="size-4 shrink-0 rounded-full object-cover"
      />
      <span className="truncate font-bold">{list.owner.displayName}</span>
      <UserBadges user={list.owner} />
      <span className="truncate text-muted">@{list.owner.handle}</span>
    </span>
  );
}

export function ListCell({
  list,
  social,
  showMemberCount = social === "followers",
  action,
}: ListCellProps) {
  return (
    <div
      data-testid="listCell"
      className="relative flex h-[72px] items-center gap-4 px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3"
    >
      <Link
        href={routes.list(list.id)}
        aria-label={list.name}
        className="absolute inset-0"
      />
      <ListThumbnail listId={list.id} bannerUrl={list.bannerUrl} />
      <span className="flex min-w-0 grow flex-col gap-0.5">
        <span className="flex min-w-0 items-center">
          <span className="truncate text-base font-bold">{list.name}</span>
          {list.private ? (
            <LockIcon
              aria-label="Private List"
              role="img"
              aria-hidden={false}
              className="ml-0.5 size-[18.75px] shrink-0"
            />
          ) : null}
          {showMemberCount ? (
            <span className="shrink-0 text-xs whitespace-pre text-muted">
              {" · "}
              {formatCount(list.memberCount)}{" "}
              {list.memberCount === 1 ? "member" : "members"}
            </span>
          ) : null}
        </span>
        {social === "followers" ? (
          <FollowersLine list={list} />
        ) : (
          <OwnerLine list={list} />
        )}
      </span>
      {action ? <span className="relative flex shrink-0">{action}</span> : null}
    </div>
  );
}
