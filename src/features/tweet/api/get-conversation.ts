import { connection } from "next/server";
import type { Tweet } from "@/types/tweet";
import { mockTweets, toTweet, type TweetRecord } from "@/mocks/tweets";

type Conversation = {
  ancestors: Tweet[];
  tweet: Tweet;
};

function findRecord(id: string | null): TweetRecord | undefined {
  return mockTweets.find((item) => item.id === id);
}

export async function getConversation(id: string): Promise<Conversation | null> {
  await connection();

  const record = findRecord(id);
  const tweet = record ? toTweet(record) : null;
  if (!record || !tweet) return null;

  const ancestors: Tweet[] = [];
  let parent = findRecord(record.replyToId);
  while (parent) {
    const ancestor = toTweet(parent);
    if (ancestor) ancestors.unshift(ancestor);
    parent = findRecord(parent.replyToId);
  }

  return { ancestors, tweet };
}
