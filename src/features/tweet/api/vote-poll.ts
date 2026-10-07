"use server";

import { refresh } from "next/cache";
import { mockTweets } from "@/mocks/tweets";

export async function votePoll(tweetId: string, optionIndex: number) {
  const poll = mockTweets.find((item) => item.id === tweetId)?.poll;
  const option = poll?.options[optionIndex];
  if (!poll || !option || poll.viewerVoteIndex !== null) return;
  if (new Date(poll.endsAt).getTime() <= Date.now()) return;

  poll.viewerVoteIndex = optionIndex;
  option.votes += 1;

  refresh();
}
