import Image from "next/image";
import Link from "next/link";
import type { Community } from "@/types/community";
import { routes } from "@/config/routes";
import { Facepile } from "@/components/ui/facepile";
import { CommunityActions } from "@/features/communities/components/community-actions";
import { MemberCount } from "@/features/communities/components/community-cell";

export function CommunityProfile({ community }: { community: Community }) {
  return (
    <div>
      <div className="relative aspect-[5/2] w-full bg-border">
        <Image
          src={community.bannerUrl}
          alt=""
          fill
          priority
          sizes="600px"
          className="object-cover"
        />
      </div>
      <div className="bg-menu-hover px-4 pt-3 pb-4">
        <h1 className="text-[31px] leading-9 font-bold break-words">
          {community.name}
        </h1>
        <span className="mt-1 inline-flex h-6 items-center rounded-full border border-outline px-3 text-base font-bold">
          {community.category}
        </span>
        <p className="mt-2 text-base break-words">{community.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Link
            href={routes.communityMembers(community.id)}
            className="flex min-w-0 items-center gap-3 hover:underline"
          >
            {community.membersPreview.length > 0 ? (
              <Facepile
                users={community.membersPreview}
                size={32}
                overlap={12}
                className="[&>img]:ring-menu-hover"
              />
            ) : null}
            <MemberCount count={community.memberCount} />
          </Link>
          <CommunityActions community={community} />
        </div>
      </div>
    </div>
  );
}
