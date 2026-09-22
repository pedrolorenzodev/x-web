import type { Tweet, TweetMedia, TweetStats } from "@/types/tweet";
import { findUserById, toSummary } from "@/mocks/users";

export type TweetRecord = {
  id: string;
  authorId: string;
  text: string;
  media: TweetMedia[];
  createdAt: string;
  replyToId: string | null;
  stats: TweetStats;
  likedByViewer: boolean;
  retweetedByViewer: boolean;
  bookmarkedByViewer: boolean;
};

export const mockTweets: TweetRecord[] = [
  {
    id: "t1",
    authorId: "u2",
    text: "Spent the morning rewriting our spacing scale. Turns out half the tokens were never used.",
    media: [
      {
        url: "/media/laptop-notebook.jpg",
        width: 1200,
        height: 800,
        alt: "Open laptop next to a sketchbook and a camera on a wooden desk",
      },
    ],
    createdAt: "2026-09-22T09:14:00.000Z",
    replyToId: null,
    stats: { replies: 12, retweets: 31, likes: 284 },
    likedByViewer: true,
    retweetedByViewer: false,
    bookmarkedByViewer: true,
  },
  {
    id: "t2",
    authorId: "u3",
    text: "Reminder that an index you never query is just a slower write.",
    media: [],
    createdAt: "2026-09-22T08:02:00.000Z",
    replyToId: null,
    stats: { replies: 5, retweets: 88, likes: 912 },
    likedByViewer: false,
    retweetedByViewer: true,
    bookmarkedByViewer: false,
  },
  {
    id: "t3",
    authorId: "u1",
    text: "Starting a clone of this app to learn the stack properly. First lesson: the hard part is never the UI.",
    media: [
      {
        url: "/media/laptop-dark.jpg",
        width: 800,
        height: 1200,
        alt: "Laptop and a notebook on a wooden table at night",
      },
      {
        url: "/media/laptop-cafe.jpg",
        width: 1200,
        height: 900,
        alt: "Laptop and a phone on a café table",
      },
    ],
    createdAt: "2026-09-22T07:30:00.000Z",
    replyToId: null,
    stats: { replies: 3, retweets: 2, likes: 47 },
    likedByViewer: false,
    retweetedByViewer: false,
    bookmarkedByViewer: false,
  },
  {
    id: "t4",
    authorId: "u4",
    text: "Shipping something small every day beats shipping something big never.",
    media: [
      {
        url: "/media/pug-blanket.jpg",
        width: 900,
        height: 1200,
        alt: "Pug wrapped in a plaid blanket on a forest path",
      },
    ],
    createdAt: "2026-09-21T19:45:00.000Z",
    replyToId: null,
    stats: { replies: 21, retweets: 140, likes: 1803 },
    likedByViewer: true,
    retweetedByViewer: false,
    bookmarkedByViewer: false,
  },
  {
    id: "t5",
    authorId: "u3",
    text: "This is exactly it. Most of the cost lives in the data model.",
    media: [],
    createdAt: "2026-09-22T07:52:00.000Z",
    replyToId: "t3",
    stats: { replies: 0, retweets: 0, likes: 9 },
    likedByViewer: false,
    retweetedByViewer: false,
    bookmarkedByViewer: false,
  },
  {
    id: "t6",
    authorId: "u2",
    text: "Welcome to the pain. Keep the contracts honest and the rest follows.",
    media: [],
    createdAt: "2026-09-22T08:11:00.000Z",
    replyToId: "t3",
    stats: { replies: 1, retweets: 0, likes: 23 },
    likedByViewer: true,
    retweetedByViewer: false,
    bookmarkedByViewer: false,
  },
  {
    id: "t7",
    authorId: "u1",
    text: "Noted. Contracts first, then the pixels.",
    media: [],
    createdAt: "2026-09-22T08:20:00.000Z",
    replyToId: "t6",
    stats: { replies: 0, retweets: 0, likes: 4 },
    likedByViewer: false,
    retweetedByViewer: false,
    bookmarkedByViewer: false,
  },
  {
    id: "t8",
    authorId: "u4",
    text: "Unpopular take: most design systems fail because nobody deletes anything.",
    media: [
      {
        url: "/media/valley-cliffs.jpg",
        width: 1200,
        height: 800,
        alt: "Granite cliffs above a river in a pine forest",
      },
      {
        url: "/media/snow-camp.jpg",
        width: 1200,
        height: 900,
        alt: "Yellow tents at a snowy mountain camp",
      },
      {
        url: "/media/canoe-lake.jpg",
        width: 1200,
        height: 675,
        alt: "Person paddling a canoe on a turquoise lake",
      },
    ],
    createdAt: "2026-09-20T15:05:00.000Z",
    replyToId: null,
    stats: { replies: 44, retweets: 210, likes: 2411 },
    likedByViewer: false,
    retweetedByViewer: false,
    bookmarkedByViewer: true,
  },
];

export const mockRetweets: { tweetId: string; userId: string }[] = [
  { tweetId: "t8", userId: "u2" },
];

export function toTweet(record: TweetRecord): Tweet | null {
  const author = findUserById(record.authorId);
  if (!author) return null;

  const parent = record.replyToId
    ? mockTweets.find((item) => item.id === record.replyToId)
    : null;
  const parentAuthor = parent ? findUserById(parent.authorId) : null;

  return {
    id: record.id,
    author: toSummary(author),
    text: record.text,
    media: record.media,
    createdAt: record.createdAt,
    replyingTo: parentAuthor ? toSummary(parentAuthor) : null,
    stats: record.stats,
    likedByViewer: record.likedByViewer,
    retweetedByViewer: record.retweetedByViewer,
    bookmarkedByViewer: record.bookmarkedByViewer,
  };
}

export function byNewest(a: { createdAt: string }, b: { createdAt: string }) {
  return b.createdAt.localeCompare(a.createdAt);
}
