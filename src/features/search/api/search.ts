import { connection } from "next/server";
import type { List } from "@/types/list";
import type { Tweet } from "@/types/tweet";
import type { User } from "@/types/user";
import { findFollowedByPreview } from "@/mocks/follows";
import { mockLists, toList } from "@/mocks/lists";
import { getMockViewer } from "@/mocks/session";
import { byNewest, mockTweets, toTweet, type TweetRecord } from "@/mocks/tweets";
import { findUserById, mockUsers, toUser, type UserRecord } from "@/mocks/users";
import type { SearchFilters } from "@/features/search/types/search-tab";
import {
  containsHashtag,
  containsMention,
  containsWord,
  hasTerms,
  hasTextTerms,
  normalizeText,
  parseQuery,
  type QueryTerms,
} from "@/features/search/utils/match-query";

const TWEET_LIMIT = 60;
const USER_LIMIT = 50;

export type TweetOrder = "top" | "latest";

const LINK = /https?:\/\//;
const NO_FILTERS: SearchFilters = { peopleYouFollow: false, nearYou: false };

function matchesContentFilter(filter: QueryTerms["replies"], present: boolean) {
  if (filter === "only") return present;
  if (filter === "exclude") return !present;
  return true;
}

function matchesTweet(record: TweetRecord, terms: QueryTerms): boolean {
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
  const day = record.createdAt.slice(0, 10);

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
    ) &&
    terms.excluded.every((word) => !containsWord(text, word)) &&
    terms.anyOf.every((options) =>
      options.some((option) => matchesTweet(record, option)),
    ) &&
    terms.from.every((from) => handle === from) &&
    terms.to.every((to) => parentHandle === to) &&
    record.stats.replies >= terms.minReplies &&
    record.stats.likes >= terms.minLikes &&
    record.stats.retweets >= terms.minReposts &&
    matchesContentFilter(terms.replies, record.replyToId !== null) &&
    matchesContentFilter(
      terms.links,
      LINK.test(record.text) || Boolean(record.card),
    ) &&
    (terms.since === null || day >= terms.since) &&
    (terms.until === null || day < terms.until)
  );
}

function countryOf(location: string | null | undefined) {
  const country = location?.split(",").at(-1)?.trim().toLowerCase();
  return country || null;
}

function filterAuthors(viewer: UserRecord | null, filters: SearchFilters) {
  const viewerCountry = countryOf(viewer?.location);
  return (user: UserRecord) =>
    (!filters.peopleYouFollow ||
      user.followedByViewer ||
      user.id === viewer?.id) &&
    (!filters.nearYou ||
      (viewerCountry !== null && countryOf(user.location) === viewerCountry));
}

function engagement(record: TweetRecord) {
  const { likes, retweets, replies, quotes } = record.stats;
  return likes + retweets * 2 + replies + quotes;
}

async function findTweetRecords(
  query: string,
  order: TweetOrder,
  filters: SearchFilters,
) {
  const terms = parseQuery(query);
  if (!hasTerms(terms)) return [];

  const allowed = filterAuthors(await getMockViewer(), filters);
  const records = mockTweets.filter((record) => {
    const author = findUserById(record.authorId);
    return author !== null && allowed(author) && matchesTweet(record, terms);
  });
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
  filters: SearchFilters = NO_FILTERS,
): Promise<Tweet[]> {
  await connection();
  const records = await findTweetRecords(query, order, filters);
  return toTweets(records.slice(0, TWEET_LIMIT));
}

export async function searchMediaTweets(
  query: string,
  filters: SearchFilters = NO_FILTERS,
): Promise<Tweet[]> {
  await connection();
  const records = await findTweetRecords(query, "top", filters);
  return toTweets(
    records.filter((record) => record.media.length > 0).slice(0, TWEET_LIMIT),
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
  filters: SearchFilters = NO_FILTERS,
): Promise<User[]> {
  await connection();
  const viewer = await getMockViewer();
  const terms = parseQuery(query);
  if (!hasTextTerms(terms)) return [];

  const allowed = filterAuthors(viewer, filters);
  return mockUsers
    .filter(
      (user) =>
        user.id !== viewer?.id && allowed(user) && matchesUser(user, terms),
    )
    .sort((a, b) => userRank(b, terms) - userRank(a, terms))
    .slice(0, limit)
    .map((user) => toUser(user, findFollowedByPreview(user.id)));
}

export async function searchLists(
  query: string,
  filters: SearchFilters = NO_FILTERS,
): Promise<List[]> {
  await connection();
  const viewer = await getMockViewer();
  const terms = parseQuery(query);
  if (!hasTextTerms(terms) || filters.nearYou) return [];

  return mockLists
    .filter((record) => !record.private || record.ownerId === viewer?.id)
    .filter(
      (record) =>
        !filters.peopleYouFollow ||
        record.ownerId === viewer?.id ||
        Boolean(findUserById(record.ownerId)?.followedByViewer),
    )
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
