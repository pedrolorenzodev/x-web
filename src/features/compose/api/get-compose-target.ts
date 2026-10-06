import { connection } from "next/server";
import type {
  ComposeSearchParams,
  ComposeTarget,
} from "@/features/compose/types/compose-target";
import { mockTweets, toTweet } from "@/mocks/tweets";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function findTweet(id: string | undefined) {
  const record = id ? mockTweets.find((item) => item.id === id) : undefined;
  return record ? toTweet(record) : null;
}

export async function getComposeTarget(
  params: ComposeSearchParams,
): Promise<ComposeTarget | null> {
  await connection();

  const parent = findTweet(firstValue(params.in_reply_to));
  if (parent) return { kind: "reply", tweet: parent };

  const quoted = findTweet(firstValue(params.quote));
  if (quoted) return { kind: "quote", tweet: quoted };

  return null;
}
