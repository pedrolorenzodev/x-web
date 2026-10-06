"use server";

import type { TypeaheadResult } from "@/types/search";
import { mockTrends } from "@/mocks/trends";
import { mockTweets } from "@/mocks/tweets";
import { mockUsers, toSummary, type UserRecord } from "@/mocks/users";
import { normalizeText } from "@/features/search/utils/match-query";

const SUGGESTION_LIMIT = 2;
const USER_LIMIT = 10;
const EDGE_PUNCTUATION = /^[^\p{L}\p{N}#_]+|[^\p{L}\p{N}_]+$/gu;
const SKIPPED_TOKEN = /^@|https?:|[./]/;
const TREND_WEIGHT = 5;
const MIN_WORD_LENGTH = 3;
const STOPWORDS = new Set([
  "the", "and", "for", "you", "with", "that", "this", "are", "was", "but",
  "not", "has", "have", "from", "its", "it's", "your", "our", "all", "can",
  "los", "las", "del", "que", "con", "por", "una", "uno", "para", "como",
  "pero", "mas", "más", "esta", "este", "eso", "sus", "nos", "les", "muy",
]);

function isKeyword(word: string | undefined): word is string {
  return (
    word !== undefined && word.length >= MIN_WORD_LENGTH && !STOPWORDS.has(word)
  );
}

function phraseCandidates(text: string) {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .map((token) =>
      SKIPPED_TOKEN.test(token) ? "" : token.replace(EDGE_PUNCTUATION, ""),
    );

  return words.flatMap((word, index) => {
    if (!isKeyword(word)) return [];
    const next = words[index + 1];
    return isKeyword(next) ? [word, `${word} ${next}`] : [word];
  });
}

function findSuggestions(query: string) {
  const prefix = normalizeText(query);
  const counts = new Map<string, number>();
  const add = (candidate: string, weight: number) => {
    const normalized = normalizeText(candidate);
    if (normalized === prefix || !normalized.startsWith(prefix)) return;
    counts.set(candidate, (counts.get(candidate) ?? 0) + weight);
  };

  for (const trend of mockTrends) add(trend.name.toLowerCase(), TREND_WEIGHT);
  for (const record of mockTweets) {
    for (const candidate of phraseCandidates(record.text)) add(candidate, 1);
  }

  return [...counts]
    .sort(([a, countA], [b, countB]) => countB - countA || a.length - b.length)
    .slice(0, SUGGESTION_LIMIT)
    .map(([candidate]) => candidate);
}

function userScore(user: UserRecord, prefix: string) {
  const handle = user.handle.toLowerCase();
  if (handle === prefix) return 3;
  if (handle.startsWith(prefix)) return 2;
  const name = normalizeText(user.displayName);
  if (name.split(/\s+/).some((part) => part.startsWith(prefix))) return 1;
  return 0;
}

function findUsers(query: string) {
  const prefix = normalizeText(query.replace(/^@/, ""));
  if (!prefix) return [];

  return mockUsers
    .map((user) => ({ user, score: userScore(user, prefix) }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || b.user.followersCount - a.user.followersCount,
    )
    .slice(0, USER_LIMIT)
    .map(({ user }) => user);
}

export async function getTypeahead(query: string): Promise<TypeaheadResult> {
  const trimmed = query.trim();
  const users = findUsers(trimmed);
  const handle = trimmed.replace(/^@/, "").toLowerCase();
  const exact = users.find((user) => user.handle.toLowerCase() === handle);

  return {
    query: trimmed,
    suggestions: trimmed.startsWith("@") ? [] : findSuggestions(trimmed),
    users: users.map(toSummary),
    exactHandle: exact?.handle ?? null,
  };
}
