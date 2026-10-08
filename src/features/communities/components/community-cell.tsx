import Image from "next/image";
import Link from "next/link";
import type { Community } from "@/types/community";
import { routes } from "@/config/routes";
import { Facepile } from "@/components/ui/facepile";
import { formatProfileCount } from "@/utils/format-profile-count";

export function MemberCount({ count }: { count: number }) {
  return (
    <span className="text-base">
      <span className="font-bold text-foreground">
        {formatProfileCount(count)}
      </span>{" "}
      <span className="text-muted">{count === 1 ? "Member" : "Members"}</span>
    </span>
  );
}

export function CommunityCell({ community }: { community: Community }) {
  return (
    <Link
      href={routes.community(community.id)}
      className="flex gap-3 px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3"
    >
      <Image
        src={community.bannerUrl}
        alt=""
        width={96}
        height={96}
        className="size-24 shrink-0 rounded-xl object-cover"
      />
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-base font-bold">{community.name}</span>
        <MemberCount count={community.memberCount} />
        <span className="truncate text-base text-muted">
          {community.category}
        </span>
        {community.membersPreview.length > 0 ? (
          <Facepile
            users={community.membersPreview}
            size={32}
            overlap={12}
            className="mt-1"
          />
        ) : null}
      </div>
    </Link>
  );
}
