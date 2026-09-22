import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { ProfileReply } from "@/features/profile/types/profile-reply";
import { findUserByHandle } from "@/mocks/users";
import { byNewest, mockTweets, toTweet } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";

const PAGE_SIZE = 20;

export async function getProfileReplies(
  handle: string,
  cursor: string | null = null,
): Promise<Page<ProfileReply>> {
  await connection();

  const author = findUserByHandle(handle);
  if (!author) return { items: [], nextCursor: null };

  const items = mockTweets
    .filter(
      (record) => record.authorId === author.id && record.replyToId !== null,
    )
    .sort(byNewest)
    .flatMap((record) => {
      const reply = toTweet(record);
      if (!reply) return [];

      const parentRecord = mockTweets.find(
        (item) => item.id === record.replyToId,
      );
      const parent = parentRecord ? toTweet(parentRecord) : null;

      return [{ parent, reply }];
    });

  return paginate(items, cursor, PAGE_SIZE, (item) => item.reply.id);
}
