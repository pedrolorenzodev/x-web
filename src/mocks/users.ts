import type { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "u1",
    handle: "pedrolorenzo",
    displayName: "Pedro Lorenzo",
    avatarUrl: "/avatars/pedro.svg",
    bio: "Building things for the web.",
    bannerUrl: "/media/banner-pedro.jpg",
    joinedAt: "2024-03-12T00:00:00.000Z",
    followingCount: 184,
    followersCount: 1243,
    postsCount: 6,
    followedByViewer: false,
  },
  {
    id: "u2",
    handle: "anarossi",
    displayName: "Ana Rossi",
    avatarUrl: "/avatars/ana.svg",
    bio: "Design systems and typography.",
    bannerUrl: "/media/banner-ana.jpg",
    joinedAt: "2023-07-01T00:00:00.000Z",
    followingCount: 512,
    followersCount: 8901,
    postsCount: 2,
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
    postsCount: 2,
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
    postsCount: 2,
    followedByViewer: true,
  },
  {
    id: "u5",
    handle: "martincabrera",
    displayName: "Martin Cabrera",
    avatarUrl: "/avatars/martin.svg",
    bio: "Infra, latency, and long walks.",
    bannerUrl: null,
    joinedAt: "2023-02-14T00:00:00.000Z",
    followingCount: 310,
    followersCount: 5620,
    postsCount: 0,
    followedByViewer: false,
  },
  {
    id: "u6",
    handle: "valenfrias",
    displayName: "Valentina Frias",
    avatarUrl: "/avatars/valen.svg",
    bio: "Front-end and motion.",
    bannerUrl: null,
    joinedAt: "2024-09-30T00:00:00.000Z",
    followingCount: 145,
    followersCount: 987,
    postsCount: 0,
    followedByViewer: false,
  },
  {
    id: "u7",
    handle: "nicobarros",
    displayName: "Nico Barros",
    avatarUrl: "/avatars/nico.svg",
    bio: "Shipping small things.",
    bannerUrl: null,
    joinedAt: "2022-05-03T00:00:00.000Z",
    followingCount: 76,
    followersCount: 1290,
    postsCount: 0,
    followedByViewer: false,
  },
];

export const mockSuggestedUserIds = ["u3", "u5", "u6", "u7"];

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
