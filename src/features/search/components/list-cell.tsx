import Image from "next/image";
import Link from "next/link";
import type { List } from "@/types/list";
import { Facepile } from "@/components/ui/facepile";
import { ListsIcon } from "@/components/ui/icons";
import { ListFollowButton } from "@/features/search/components/list-follow-button";

type ListCellProps = {
  list: List;
  viewerId: string;
  toggleListFollow: (listId: string) => Promise<void>;
};

function ListThumbnail({ list }: { list: List }) {
  if (list.bannerUrl) {
    return (
      <Image
        src={list.bannerUrl}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-xl object-cover"
      />
    );
  }

  return (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-white">
      <ListsIcon className="size-6" />
    </span>
  );
}

function ListSocialLine({ list }: { list: List }) {
  const [firstFollower] = list.followersPreview;

  if (firstFollower) {
    return (
      <span className="flex min-w-0 items-center gap-1 text-xs text-muted">
        <Facepile users={list.followersPreview} />
        <span className="truncate">
          {list.followerCount} {list.followerCount === 1 ? "follower" : "followers"}{" "}
          including @{firstFollower.handle}
        </span>
      </span>
    );
  }

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
      <span className="truncate text-muted">@{list.owner.handle}</span>
    </span>
  );
}

export function ListCell({ list, viewerId, toggleListFollow }: ListCellProps) {
  return (
    <div className="relative flex items-center gap-4 px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3">
      <Link
        href={`/i/lists/${list.id}`}
        aria-label={list.name}
        className="absolute inset-0"
      />
      <ListThumbnail list={list} />
      <span className="flex min-w-0 grow flex-col gap-0.5">
        <span className="flex min-w-0 items-baseline">
          <span className="truncate text-base font-bold">{list.name}</span>
          <span className="shrink-0 text-xs whitespace-pre text-muted">
            {" · "}
            {list.memberCount} members
          </span>
        </span>
        <ListSocialLine list={list} />
      </span>
      {list.owner.id === viewerId ? null : (
        <ListFollowButton
          listId={list.id}
          following={list.followedByViewer}
          toggleListFollow={toggleListFollow}
        />
      )}
    </div>
  );
}
