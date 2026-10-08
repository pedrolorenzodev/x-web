"use client";

import { useState } from "react";
import type { Community } from "@/types/community";
import { BackButton } from "@/components/layout/back-button";
import { EmptyState } from "@/components/ui/empty-state";
import { PillSearchInput } from "@/components/ui/pill-search-input";
import { CommunityCell } from "@/features/communities/components/community-cell";
import {
  matchesSelection,
  TopicChips,
  type TopicSelection,
} from "@/features/communities/components/topic-chips";

function matchesQuery(community: Community, query: string) {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const haystack =
    `${community.name} ${community.category} ${community.topic} ${community.description}`.toLowerCase();
  return terms.every((term) => haystack.includes(term));
}

export function DiscoverCommunities({
  communities,
}: {
  communities: Community[];
}) {
  const [query, setQuery] = useState("");
  const [selection, setSelection] = useState<TopicSelection>({
    topic: null,
    subcategory: null,
  });
  const visible = communities.filter(
    (community) =>
      matchesSelection(selection, community) && matchesQuery(community, query),
  );

  return (
    <>
      <div className="sticky top-0 z-3 bg-background/65 backdrop-blur-[12px]">
        <div className="flex h-[53px] items-center px-4">
          <div className="min-w-14">
            <BackButton />
          </div>
          <PillSearchInput
            value={query}
            label="Search for Communities and Posts"
            placeholder="Search for Communities and Posts"
            onValueChange={setQuery}
            className="min-w-0 flex-1 self-start mt-[8.5px]"
          />
        </div>
      </div>
      <h2 className="px-4 pt-3 pb-1.5 text-xl font-extrabold">
        Discover Communities
      </h2>
      <TopicChips
        selection={selection}
        onChange={setSelection}
        className="mb-1.5"
      />
      {visible.length > 0 ? (
        visible.map((community) => (
          <CommunityCell key={community.id} community={community} />
        ))
      ) : (
        <EmptyState
          title="No Communities found"
          body="Try searching for something else or pick another category."
        />
      )}
    </>
  );
}
