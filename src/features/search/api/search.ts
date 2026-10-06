import { connection } from "next/server";
import type { List } from "@/types/list";
import type { Tweet } from "@/types/tweet";
import type { User } from "@/types/user";
import { findFollowedByPreview } from "@/mocks/follows";
import { mockLists, toList } from "@/mocks/lists";
import { getMockViewer } from "@/mocks/session";
import { byNewest, mockTweets, toTweet, type TweetRecord } from "@/mocks/tweets";
import { findUserById, mockUsers, toUser, type UserRecord } from "@/mocks/users";
import {
  containsHashtag,
  containsMention,
  containsWord,
  hasTerms,
  normalizeText,
  parseQuery,
  type QueryTerms,
} from "@/features/search/utils/match-query";

const TWEET_LIMIT = 60;
const USER_LIMIT = 50;

export type TweetOrder = "top" | "latest";

function matchesTweet(record: TweetRecord, terms: QueryTerms) {
  const author = findUserById(record.authorId);
  if (!author) return false;

  const text = normalizeText(record.text);
  const handle = author.handle.toLowerCase();
  const name = normalizeText(author.displayName);
  const parent = record.replyToId
    ? mockTweets.find((item) => item.id === record.replyToId)
    : null;
  const parentHandle = parent
    ? findUserById(parent.authorId)?.handle.toLowerCase()
    : null;

  return (
    terms.words.every(
      (word) =>
        containsWord(text, word) ||
        containsWord(name, word) ||
        handle.includes(word),
    ) &&
    terms.phrases.every((phrase) => text.includes(phrase)) &&
    terms.hashtags.every((tag) => containsHashtag(text, tag)) &&
    terms.mentions.every(
      (mention) =>
        containsMention(text, mention) ||
        handle === mention ||
        parentHandle === mention,
    )
  );
}

function engagement(record: TweetRecord) {
  const { likes, retweets, replies, quotes } = record.stats;
  return likes + retweets * 2 + replies + quotes;
}

function findTweetRecords(query: string, order: TweetOrder) {
  const terms = parseQuery(query);
  if (!hasTerms(terms)) return [];

  const records = mockTweets.filter((record) => matchesTweet(record, terms));
  return order === "latest"
    ? records.sort(byNewest)
    : records.sort((a, b) => engagement(b) - engagement(a) || byNewest(a, b));
}

function toTweets(records: TweetRecord[]): Tweet[] {
  return records.flatMap((record) => toTweet(record) ?? []);
}

export async function searchTweets(
  query: string,
  order: TweetOrder,
): Promise<Tweet[]> {
  await connection();
  return toTweets(findTweetRecords(query, order).slice(0, TWEET_LIMIT));
}

export async function searchMediaTweets(query: string): Promise<Tweet[]> {
  await connection();
  return toTweets(
    findTweetRecords(query, "top")
      .filter((record) => record.media.length > 0)
      .slice(0, TWEET_LIMIT),
  );
}

function matchesUser(user: UserRecord, terms: QueryTerms) {
  const handle = user.handle.toLowerCase();
  const name = normalizeText(user.displayName);
  const bio = normalizeText(user.bio);

  return (
    terms.words.every(
      (word) =>
        handle.includes(word) ||
        containsWord(bio, word) ||
        name.split(/\s+/).some((part) => part.startsWith(word)),
    ) &&
    terms.phrases.every(
      (phrase) => name.includes(phrase) || bio.includes(phrase),
    ) &&
    terms.hashtags.every((tag) => containsHashtag(bio, tag)) &&
    terms.mentions.every(
      (mention) => handle.startsWith(mention) || containsMention(bio, mention),
    )
  );
}

function userRank(user: UserRecord, terms: QueryTerms) {
  const handle = user.handle.toLowerCase();
  const exact = [...terms.words, ...terms.mentions].includes(handle);
  return exact ? Number.MAX_SAFE_INTEGER : user.followersCount;
}

export async function searchUsers(
  query: string,
  limit = USER_LIMIT,
): Promise<User[]> {
  await connection();
  const viewer = await getMockViewer();
  const terms = parseQuery(query);
  if (!hasTerms(terms)) return [];

  return mockUsers
    .filter((user) => user.id !== viewer?.id && matchesUser(user, terms))
    .sort((a, b) => userRank(b, terms) - userRank(a, terms))
    .slice(0, limit)
    .map((user) => toUser(user, findFollowedByPreview(user.id)));
}

export async function searchLists(query: string): Promise<List[]> {
  await connection();
  const viewer = await getMockViewer();
  const terms = parseQuery(query);
  if (!hasTerms(terms)) return [];

  return mockLists
    .filter((record) => !record.private || record.ownerId === viewer?.id)
    .filter((record) => {
      const name = normalizeText(record.name);
      const description = normalizeText(record.description);
      return (
        terms.words.every(
          (word) => containsWord(name, word) || containsWord(description, word),
        ) &&
        terms.phrases.every(
          (phrase) => name.includes(phrase) || description.includes(phrase),
        ) &&
        terms.hashtags.every((tag) => containsHashtag(description, tag)) &&
        terms.mentions.length === 0
      );
    })
    .sort((a, b) => b.followerCount - a.followerCount)
    .flatMap((record) => toList(record) ?? []);
}
