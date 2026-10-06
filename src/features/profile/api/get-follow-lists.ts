"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { FollowedByPreview, User } from "@/types/user";
import {
  findUserByHandle,
  findUserById,
  mockUsers,
  toSummary,
  toUser,
  type UserRecord,
} from "@/mocks/users";
import { mockRetweets, mockTweets } from "@/mocks/tweets";
import { findFollowedByPreview } from "@/mocks/follows";
import { getMockViewer } from "@/mocks/session";
import { paginate } from "@/utils/paginate";
import type {
  FollowListKind,
  FollowListScreenData,
} from "@/features/profile/types/follow-list";

const PAGE_SIZE = 20;
const PREVIEW_SIZE = 3;
const MIN_EDGE_RATE = 0.12;
const MAX_EDGE_RATE = 0.42;
const REACH_DIGITS = 8;

type Edge = { from: string; to: string; rank: number };

type FollowGraph = {
  followers: Map<string, string[]>;
  following: Map<string, string[]>;
};

let cachedGraph: { viewerId: string; graph: FollowGraph } | null = null;

function unitHash(key: string) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < key.length; index++) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x85ebca6b);
  hash ^= hash >>> 13;
  hash = Math.imul(hash, 0xc2b2ae35);
  hash ^= hash >>> 16;
  return (hash >>> 0) / 0x100000000;
}

function stableFollowersCount(user: UserRecord) {
  return user.followersCount - (user.followedByViewer ? 1 : 0);
}

function stableFollowingCount(user: UserRecord) {
  return user.followingCount - (user.followsViewer ? 1 : 0);
}

function edgeRate(target: UserRecord) {
  const reach = Math.log10(stableFollowersCount(target) + 1) / REACH_DIGITS;
  return MIN_EDGE_RATE + (MAX_EDGE_RATE - MIN_EDGE_RATE) * Math.min(1, reach);
}

function edgeRank(from: string, to: string) {
  return unitHash(`${from}>${to}`);
}

function findEngagementEdges(memberIds: Set<string>): Edge[] {
  const authorByTweet = new Map(
    mockTweets.map((record) => [record.id, record.authorId]),
  );
  const pairs = new Set<string>();
  const edges: Edge[] = [];

  function add(from: string, tweetId: string | null) {
    const to = tweetId ? authorByTweet.get(tweetId) : undefined;
    const key = `${from}>${to}`;
    if (!to || from === to || pairs.has(key)) return;
    if (!memberIds.has(from) || !memberIds.has(to)) return;
    pairs.add(key);
    edges.push({ from, to, rank: edgeRank(from, to) });
  }

  for (const record of mockTweets) {
    add(record.authorId, record.replyToId);
    add(record.authorId, record.quotedId);
  }
  for (const retweet of mockRetweets) add(retweet.userId, retweet.tweetId);

  return edges;
}

function findSampledEdges(members: UserRecord[]): Edge[] {
  const edges: Edge[] = [];
  for (const target of members) {
    const rate = edgeRate(target);
    for (const source of members) {
      if (source.id === target.id) continue;
      const rank = edgeRank(source.id, target.id);
      if (rank < rate) edges.push({ from: source.id, to: target.id, rank });
    }
  }
  return edges.sort((a, b) => a.rank - b.rank);
}

function push(map: Map<string, Edge[]>, key: string, edge: Edge) {
  const list = map.get(key);
  if (list) list.push(edge);
  else map.set(key, [edge]);
}

function toSortedIds(map: Map<string, Edge[]>, pick: (edge: Edge) => string) {
  return new Map(
    [...map].map(([key, edges]) => [
      key,
      edges.sort((a, b) => a.rank - b.rank).map(pick),
    ]),
  );
}

function buildGraph(viewerId: string): FollowGraph {
  const members = mockUsers.filter((user) => user.id !== viewerId);
  const byId = new Map(members.map((user) => [user.id, user]));
  const incoming = new Map<string, Edge[]>();
  const outgoing = new Map<string, Edge[]>();
  const linked = new Set<string>();

  function link(edge: Edge) {
    linked.add(`${edge.from}>${edge.to}`);
    push(incoming, edge.to, edge);
    push(outgoing, edge.from, edge);
  }

  for (const edge of findEngagementEdges(new Set(byId.keys()))) link(edge);

  for (const edge of findSampledEdges(members)) {
    const source = byId.get(edge.from);
    const target = byId.get(edge.to);
    if (!source || !target || linked.has(`${edge.from}>${edge.to}`)) continue;
    const following = outgoing.get(edge.from)?.length ?? 0;
    const followers = incoming.get(edge.to)?.length ?? 0;
    if (following >= stableFollowingCount(source)) continue;
    if (followers >= stableFollowersCount(target)) continue;
    link(edge);
  }

  return {
    followers: toSortedIds(incoming, (edge) => edge.from),
    following: toSortedIds(outgoing, (edge) => edge.to),
  };
}

function getGraph(viewerId: string) {
  if (cachedGraph?.viewerId !== viewerId) {
    cachedGraph = { viewerId, graph: buildGraph(viewerId) };
  }
  return cachedGraph.graph;
}

function findFollowers(user: UserRecord, viewer: UserRecord) {
  if (user.id === viewer.id) {
    return mockUsers.filter((other) => other.followsViewer && other.id !== viewer.id);
  }
  const ids = getGraph(viewer.id).followers.get(user.id) ?? [];
  const followers = ids.flatMap((id) => findUserById(id) ?? []);
  return user.followedByViewer ? [viewer, ...followers] : followers;
}

function findFollowing(user: UserRecord, viewer: UserRecord) {
  if (user.id === viewer.id) {
    return mockUsers.filter((other) => other.followedByViewer && other.id !== viewer.id);
  }
  const ids = getGraph(viewer.id).following.get(user.id) ?? [];
  const following = ids.flatMap((id) => findUserById(id) ?? []);
  return user.followsViewer ? [viewer, ...following] : following;
}

function findListed(kind: FollowListKind, user: UserRecord, viewer: UserRecord) {
  switch (kind) {
    case "following":
      return findFollowing(user, viewer);
    case "followers":
      return findFollowers(user, viewer);
    case "verified_followers":
      return findFollowers(user, viewer).filter((other) => other.verified);
    case "followers_you_follow":
      return findFollowers(user, viewer).filter((other) => other.followedByViewer);
  }
}

function isLocked(user: UserRecord, viewer: UserRecord) {
  return Boolean(user.protected) && !user.followedByViewer && user.id !== viewer.id;
}

function toListPage(
  listed: UserRecord[],
  cursor: string | null,
): Page<User> {
  const page = paginate(listed, cursor, PAGE_SIZE, (user) => user.id);
  return {
    items: page.items.map((user) => toUser(user, findFollowedByPreview(user.id))),
    nextCursor: page.nextCursor,
  };
}

export async function getFollowList(
  handle: string,
  kind: FollowListKind,
  cursor: string | null = null,
): Promise<Page<User>> {
  await connection();
  const viewer = await getMockViewer();
  const user = findUserByHandle(handle);
  if (!viewer || !user || isLocked(user, viewer)) {
    return { items: [], nextCursor: null };
  }
  return toListPage(findListed(kind, user, viewer), cursor);
}

export async function getFollowListScreen(
  handle: string,
  kind: FollowListKind,
): Promise<FollowListScreenData | null> {
  await connection();
  const viewer = await getMockViewer();
  const user = findUserByHandle(handle);
  if (!viewer || !user) return null;

  const isViewer = user.id === viewer.id;
  const locked = isLocked(user, viewer);
  const hasFollowersYouKnow =
    !isViewer &&
    !locked &&
    findListed("followers_you_follow", user, viewer).length > 0;

  return {
    profile: toUser(user, findFollowedByPreview(user.id)),
    viewerId: viewer.id,
    isViewer,
    locked,
    hasFollowersYouKnow,
    firstPage: locked
      ? { items: [], nextCursor: null }
      : toListPage(findListed(kind, user, viewer), null),
  };
}

export async function getFollowersYouKnowPreview(
  handle: string,
): Promise<FollowedByPreview> {
  const viewer = await getMockViewer();
  const user = findUserByHandle(handle);
  if (!viewer || !user || user.id === viewer.id || isLocked(user, viewer)) {
    return { users: [], total: 0 };
  }
  const listed = findListed("followers_you_follow", user, viewer);
  return {
    users: listed.slice(0, PREVIEW_SIZE).map(toSummary),
    total: listed.length,
  };
}
