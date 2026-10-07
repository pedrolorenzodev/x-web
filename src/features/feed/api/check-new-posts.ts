"use server";

import type { NewPostsPreview } from "@/features/feed/types/new-posts";
import { getMockViewer } from "@/mocks/session";
import { findUserById, toSummary } from "@/mocks/users";
import { peekIncomingBatch } from "@/mocks/incoming-tweets";
import { isListTimelineKind, toTimelineKind } from "@/features/feed/types/timeline-kind";

const MAX_PREVIEW_AUTHORS = 3;

export async function checkNewPosts(kind: string): Promise<NewPostsPreview | null> {
  const viewer = await getMockViewer();
  if (!viewer || isListTimelineKind(toTimelineKind(kind))) return null;

  const authors = peekIncomingBatch()
    .filter((post) => post.authorId !== viewer.id)
    .flatMap((post) => {
      const author = findUserById(post.authorId);
      return author ? [toSummary(author)] : [];
    });
  if (!authors.length) return null;

  return {
    count: authors.length,
    authors: authors.slice(0, MAX_PREVIEW_AUTHORS),
  };
}
