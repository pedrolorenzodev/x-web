"use server";

import { refresh } from "next/cache";
import type { NewPost, NewTweetInput, Poll } from "@/types/tweet";
import { getMockViewer } from "@/mocks/session";
import { mockTweets } from "@/mocks/tweets";
import { createDraftId, mockDrafts } from "@/mocks/drafts";
import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { MAX_POLL_CHOICES, MIN_POLL_CHOICES } from "@/config/compose";

type CreatedTweet = {
  id: string;
  handle: string;
  scheduledAt: string | null;
};

const MINUTE_MS = 60_000;

function findRecord(id: string | null) {
  return id ? mockTweets.find((item) => item.id === id) : undefined;
}

function isValidPoll(poll: NewPost["poll"]) {
  if (!poll) return true;
  const choices = poll.choices.filter((choice) => choice.trim());
  return (
    choices.length >= MIN_POLL_CHOICES &&
    choices.length <= MAX_POLL_CHOICES &&
    poll.durationMinutes > 0
  );
}

function isValidPost(post: NewPost, allowEmpty: boolean) {
  const length = [...post.text.trim()].length;
  if (length > MAX_TWEET_LENGTH) return false;
  if (!isValidPoll(post.poll)) return false;
  return length > 0 || post.media.length > 0 || allowEmpty;
}

function toPoll(poll: NewPost["poll"], createdAt: number): Poll | undefined {
  if (!poll) return undefined;
  return {
    options: poll.choices
      .filter((choice) => choice.trim())
      .map((choice) => ({ label: choice.trim(), votes: 0 })),
    endsAt: new Date(createdAt + poll.durationMinutes * MINUTE_MS).toISOString(),
    viewerVoteIndex: null,
  };
}

export async function createTweet({
  posts,
  replyToId,
  quotedId,
  replySettings,
  scheduledAt,
  draftId,
}: NewTweetInput): Promise<CreatedTweet> {
  const viewer = await getMockViewer();
  if (!viewer) throw new Error("No viewer session");
  if (posts.length === 0) throw new Error("Nothing to post");

  const valid = posts.every((post, index) =>
    isValidPost(post, index === 0 && Boolean(quotedId)),
  );
  if (!valid) throw new Error("Invalid post");

  const parent = findRecord(replyToId);
  if (replyToId && !parent) throw new Error("Parent tweet not found");

  const quoted = findRecord(quotedId);
  if (quotedId && !quoted) throw new Error("Quoted tweet not found");

  const now = Date.now();
  const draftIndex = draftId
    ? mockDrafts.findIndex(
        (draft) => draft.id === draftId && draft.ownerId === viewer.id,
      )
    : -1;
  if (draftIndex >= 0) mockDrafts.splice(draftIndex, 1);

  if (scheduledAt) {
    if (Date.parse(scheduledAt) <= now) throw new Error("Schedule is past");
    const id = createDraftId();
    mockDrafts.push({
      id,
      ownerId: viewer.id,
      posts,
      replySettings,
      replyToId: parent?.id ?? null,
      quotedId: quoted?.id ?? null,
      scheduledAt,
      updatedAt: new Date(now).toISOString(),
    });
    refresh();
    return { id, handle: viewer.handle, scheduledAt };
  }

  let previousId = parent?.id ?? null;
  let firstId = "";

  posts.forEach((post, index) => {
    const id = `t${now + index}`;
    const createdAt = now + index;
    mockTweets.push({
      id,
      authorId: viewer.id,
      text: post.text.trim(),
      media: post.media,
      createdAt: new Date(createdAt).toISOString(),
      replyToId: previousId,
      quotedId: index === 0 ? (quoted?.id ?? null) : null,
      replySettings,
      poll: toPoll(post.poll, createdAt),
      stats: {
        replies: 0,
        retweets: 0,
        quotes: 0,
        likes: 0,
        bookmarks: 0,
        views: 0,
      },
      likedByViewer: false,
      retweetedByViewer: false,
      bookmarkedByViewer: false,
    });

    const previous = findRecord(previousId);
    if (previous) previous.stats.replies += 1;
    if (index === 0) firstId = id;
    previousId = id;
  });

  if (quoted) quoted.stats.quotes += 1;
  viewer.postsCount += posts.length;

  refresh();
  return { id: firstId, handle: viewer.handle, scheduledAt: null };
}
