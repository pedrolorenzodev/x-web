"use client";

import { useState, type ReactNode } from "react";
import type { CommunityTopic } from "@/types/community";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { CommunitiesSearchLink } from "@/features/communities/components/communities-search-link";
import {
  matchesSelection,
  TopicChips,
  type TopicSelection,
} from "@/features/communities/components/topic-chips";

export type CommunityFeedItem = {
  id: string;
  topic: CommunityTopic;
  category: string;
  post: ReactNode;
};

export function CommunitiesFeed({ items }: { items: CommunityFeedItem[] }) {
  const [selection, setSelection] = useState<TopicSelection>({
    topic: null,
    subcategory: null,
  });
  const visible = items.filter((item) => matchesSelection(selection, item));

  return (
    <>
      <PageHeader title="Communities" action={<CommunitiesSearchLink />}>
        <TopicChips selection={selection} onChange={setSelection} />
      </PageHeader>
      {visible.length > 0 ? (
        visible.map((item) => <div key={item.id}>{item.post}</div>)
      ) : (
        <EmptyState
          title="Nothing to see here — yet"
          body="Posts from Communities in this category will show up here."
        />
      )}
    </>
  );
}
