"use server";

import { getMockViewer } from "@/mocks/session";
import { mockTweets } from "@/mocks/tweets";
import { markIncomingDelivered, takeIncomingBatch } from "@/mocks/incoming-tweets";

const STAGGER_MS = 20_000;
const INITIAL_VIEWS = 12;

export async function showNewPosts() {
  const viewer = await getMockViewer();
  if (!viewer) return;

  const now = Date.now();
  takeIncomingBatch()
    .filter((post) => post.authorId !== viewer.id)
    .forEach((post, index) => {
      const id = `t${now}${index}`;
      mockTweets.push({
        id,
        authorId: post.authorId,
        text: post.text,
        media: [],
        createdAt: new Date(now - index * STAGGER_MS).toISOString(),
        replyToId: null,
        quotedId: null,
        stats: {
          replies: 0,
          retweets: 0,
          quotes: 0,
          likes: 0,
          bookmarks: 0,
          views: INITIAL_VIEWS,
        },
        likedByViewer: false,
        retweetedByViewer: false,
        bookmarkedByViewer: false,
      });
      markIncomingDelivered(id);
    });
}
