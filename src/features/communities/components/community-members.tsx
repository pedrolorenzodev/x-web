"use client";

import { useState } from "react";
import type { CommunityMember } from "@/types/community";
import type { ToggleFollow } from "@/types/user";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { PillSearchInput } from "@/components/ui/pill-search-input";
import { Tab } from "@/components/ui/tab";
import { TabBar } from "@/components/ui/tab-bar";
import { MemberCell } from "@/features/communities/components/member-cell";

type CommunityMembersProps = {
  communityId: string;
  tab: "all" | "moderators";
  members: CommunityMember[];
  viewerId: string;
  toggleFollow: ToggleFollow;
};

export function CommunityMembers({
  communityId,
  tab,
  members,
  viewerId,
  toggleFollow,
}: CommunityMembersProps) {
  const [query, setQuery] = useState("");
  const term = query.toLowerCase().trim();
  const visible = members
    .filter((member) => tab === "all" || member.role !== "member")
    .filter(
      ({ user }) =>
        !term ||
        user.displayName.toLowerCase().includes(term) ||
        user.handle.toLowerCase().includes(term),
    );

  return (
    <>
      <PageHeader title="Members">
        <div className="px-4 pt-1 pb-2">
          <PillSearchInput
            value={query}
            label="Search for people"
            placeholder="Search for people"
            onValueChange={setQuery}
          />
        </div>
        <TabBar label="Members">
          <Tab
            label="All"
            active={tab === "all"}
            href={routes.communityMembers(communityId)}
          />
          <Tab
            label="Moderators"
            active={tab === "moderators"}
            href={routes.communityModerators(communityId)}
          />
        </TabBar>
      </PageHeader>
      <div className="pb-[200px]">
        {visible.length > 0 ? (
          visible.map((member) => (
            <MemberCell
              key={member.user.id}
              member={member}
              viewerId={viewerId}
              toggleFollow={toggleFollow}
            />
          ))
        ) : (
          <EmptyState
            title={`No results for "${query}"`}
            body="Try searching for something else."
          />
        )}
      </div>
    </>
  );
}
