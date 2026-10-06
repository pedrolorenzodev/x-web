"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { TimelineItem } from "@/types/tweet";
import type { ProfilePhoto } from "@/features/profile/types/profile-photo";
import { findUserByHandle, type UserRecord } from "@/mocks/users";
import { byNewest, mockTweets, toTweet, type TweetRecord } from "@/mocks/tweets";
import { paginate } from "@/utils/paginate";

const VIDEO_PAGE_SIZE = 20;
const PHOTO_PAGE_SIZE = 30;

function authoredMedia(author: UserRecord, type: "photo" | "video") {
  return mockTweets
    .filter(
      (record) =>
        record.authorId === author.id &&
        record.media.some((media) => media.type === type),
    )
    .sort(byNewest);
}

export async function getProfileVideos(
  handle: string,
  cursor: string | null = null,
  limit = VIDEO_PAGE_SIZE,
): Promise<Page<TimelineItem>> {
  await connection();

  const author = findUserByHandle(handle);
  if (!author) return { items: [], nextCursor: null };

  const items = authoredMedia(author, "video").flatMap((record) => {
    const tweet = toTweet(record);
    return tweet ? [{ tweet, retweetedBy: null }] : [];
  });

  return paginate(items, cursor, limit, (item) => item.tweet.id);
}

function toProfilePhoto(record: TweetRecord, handle: string): ProfilePhoto[] {
  const photos = record.media.filter((media) => media.type === "photo");
  const [photo] = photos;
  return photo
    ? [{ tweetId: record.id, handle, photo, count: photos.length }]
    : [];
}

export async function getProfilePhotos(
  handle: string,
  cursor: string | null = null,
  limit = PHOTO_PAGE_SIZE,
): Promise<Page<ProfilePhoto>> {
  await connection();

  const author = findUserByHandle(handle);
  if (!author) return { items: [], nextCursor: null };

  const items = authoredMedia(author, "photo").flatMap((record) =>
    toProfilePhoto(record, author.handle),
  );

  return paginate(items, cursor, limit, (item) => item.tweetId);
}
