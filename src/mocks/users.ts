import type { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "u1",
    handle: "pedrolorenzo",
    displayName: "Pedro Lorenzo",
    avatarUrl: "/avatars/pedro.svg",
    bio: "Building things for the web.",
    bannerUrl: null,
    joinedAt: "2024-03-12T00:00:00.000Z",
    followingCount: 184,
    followersCount: 1243,
    followedByViewer: false,
  },
  {
    id: "u2",
    handle: "anarossi",
    displayName: "Ana Rossi",
    avatarUrl: "/avatars/ana.svg",
    bio: "Design systems and typography.",
    bannerUrl: null,
    joinedAt: "2023-07-01T00:00:00.000Z",
    followingCount: 512,
    followersCount: 8901,
    followedByViewer: true,
  },
  {
    id: "u3",
    handle: "lucasvidal",
    displayName: "Lucas Vidal",
    avatarUrl: "/avatars/lucas.svg",
    bio: "Backend, databases, coffee.",
    bannerUrl: null,
    joinedAt: "2022-11-20T00:00:00.000Z",
    followingCount: 97,
    followersCount: 430,
    followedByViewer: false,
  },
  {
    id: "u4",
    handle: "sofiamendez",
    displayName: "Sofia Mendez",
    avatarUrl: "/avatars/sofia.svg",
    bio: "Writing about product.",
    bannerUrl: null,
    joinedAt: "2025-01-08T00:00:00.000Z",
    followingCount: 233,
    followersCount: 2077,
    followedByViewer: true,
  },
];

export const mockViewerId = "u1";

export function findUserById(id: string): User | null {
  return mockUsers.find((user) => user.id === id) ?? null;
}

export function findUserByHandle(handle: string): User | null {
  return mockUsers.find((user) => user.handle === handle) ?? null;
}

export function toSummary(user: User) {
  return {
    id: user.id,
    handle: user.handle,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };
}
