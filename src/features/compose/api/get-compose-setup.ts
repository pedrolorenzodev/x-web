import { connection } from "next/server";
import type {
  ComposeSearchParams,
  ComposeSetup,
  ComposeTarget,
} from "@/features/compose/types/compose-target";
import { getMockViewer } from "@/mocks/session";
import { mockDrafts, toDraft } from "@/mocks/drafts";
import { mockTweets, toTweet } from "@/mocks/tweets";

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function findTweet(id: string | null | undefined) {
  const record = id ? mockTweets.find((item) => item.id === id) : undefined;
  return record ? toTweet(record) : null;
}

function findTarget(
  replyToId: string | null | undefined,
  quotedId: string | null | undefined,
): ComposeTarget | null {
  const parent = findTweet(replyToId);
  if (parent) return { kind: "reply", tweet: parent };

  const quoted = findTweet(quotedId);
  if (quoted) return { kind: "quote", tweet: quoted };

  return null;
}

export async function getComposeSetup(
  params: ComposeSearchParams,
): Promise<ComposeSetup> {
  await connection();

  const viewer = await getMockViewer();
  const draftId = firstValue(params.draft);
  const record =
    draftId && viewer
      ? mockDrafts.find(
          (draft) => draft.id === draftId && draft.ownerId === viewer.id,
        )
      : undefined;

  if (record) {
    return {
      target: findTarget(record.replyToId, record.quotedId),
      draft: toDraft(record),
      text: "",
    };
  }

  return {
    target: findTarget(firstValue(params.in_reply_to), firstValue(params.quote)),
    draft: null,
    text: firstValue(params.text) ?? "",
  };
}
