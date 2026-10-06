import { connection } from "next/server";
import type { Tweet } from "@/types/tweet";
import { getMockViewer } from "@/mocks/session";
import { byNewest, mockTweets, toTweet } from "@/mocks/tweets";
import { mockListMembers } from "@/mocks/lists";
import { findVisibleList } from "@/features/lists/api/find-list-record";

const LIST_TIMELINE_SIZE = 40;

export async function getListTweets(listId: string): Promise<Tweet[]> {
  await connection();
  const viewer = await getMockViewer();
  if (!findVisibleList(listId, viewer?.id ?? null)) return [];

  const memberIds = new Set(
    mockListMembers
      .filter((member) => member.listId === listId)
      .map((member) => member.userId),
  );

  return mockTweets
    .filter(
      (record) => record.replyToId === null && memberIds.has(record.authorId),
    )
    .sort(byNewest)
    .slice(0, LIST_TIMELINE_SIZE)
    .flatMap((record) => toTweet(record) ?? []);
}
