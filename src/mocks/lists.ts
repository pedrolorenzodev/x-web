import type { List, ListMember } from "@/types/list";
import { findUserById, toSummary } from "@/mocks/users";

export type ListRecord = Omit<
  List,
  "owner" | "memberCount" | "followersPreview"
> & {
  ownerId: string;
  followerPreviewIds: string[];
  pinnedAt?: string;
};

const TWITTER_EPOCH_MS = BigInt(1288834974657);
let listSequence = BigInt(0);

export function createListId() {
  listSequence = (listSequence + BigInt(1)) % BigInt(4096);
  const elapsed = BigInt(Date.now()) - TWITTER_EPOCH_MS;
  return ((elapsed << BigInt(22)) + listSequence).toString();
}

export const mockLists: ListRecord[] = [
  {
    id: "2087605031534320824",
    ownerId: "1702741923755094016",
    name: "Paisanos",
    description: "La gente de paisanos.io",
    bannerUrl: "/media/laptop-cafe.jpg",
    private: false,
    followerCount: 3,
    createdAt: "2026-08-12T18:20:00.000Z",
    followedByViewer: false,
    pinnedByViewer: true,
    hiddenFromForYou: false,
    followerPreviewIds: [
      "9100000000000000002",
      "9100000000000000006",
    ],
  },
  {
    id: "2095619088187124923",
    ownerId: "1702741923755094016",
    name: "3D & creative coding",
    description: "Three.js, shaders y experimentos que me inspiran",
    bannerUrl: "/media/valley-cliffs.jpg",
    private: false,
    followerCount: 1,
    createdAt: "2026-09-03T21:05:00.000Z",
    followedByViewer: false,
    pinnedByViewer: false,
    hiddenFromForYou: false,
    followerPreviewIds: [
      "9100000000000000001",
    ],
  },
  {
    id: "2101682793479929022",
    ownerId: "1702741923755094016",
    name: "AI builders",
    description: "",
    bannerUrl: null,
    private: true,
    followerCount: 0,
    createdAt: "2026-09-20T14:40:00.000Z",
    followedByViewer: false,
    pinnedByViewer: false,
    hiddenFromForYou: false,
    followerPreviewIds: [],
  },
  {
    id: "1984953635438333121",
    ownerId: "9100000000000000004",
    name: "Devs argentinos",
    description: "Desarrolladores de Argentina que vale la pena seguir",
    bannerUrl: "/media/laptop-notebook.jpg",
    private: false,
    followerCount: 2412,
    createdAt: "2025-11-02T12:00:00.000Z",
    followedByViewer: false,
    pinnedByViewer: false,
    hiddenFromForYou: false,
    followerPreviewIds: [
      "9100000000000000004",
    ],
  },
  {
    id: "1935351796334337220",
    ownerId: "9100000000000000003",
    name: "Product builders LATAM",
    description: "Gente construyendo productos digitales en Latinoamérica",
    bannerUrl: null,
    private: false,
    followerCount: 1180,
    createdAt: "2025-06-18T15:00:00.000Z",
    followedByViewer: false,
    pinnedByViewer: false,
    hiddenFromForYou: false,
    followerPreviewIds: [
      "9100000000000000001",
      "9100000000000000002",
    ],
  },
  {
    id: "1898675124436741319",
    ownerId: "9100000000000000003",
    name: "Creative coders",
    description: "Code as a medium: generative art, WebGL and motion",
    bannerUrl: "/media/snow-camp.jpg",
    private: false,
    followerCount: 864,
    createdAt: "2025-03-09T10:00:00.000Z",
    followedByViewer: false,
    pinnedByViewer: false,
    hiddenFromForYou: false,
    followerPreviewIds: [
      "9100000000000000001",
    ],
  },
  {
    id: "1863206412091145418",
    ownerId: "9100000000000000005",
    name: "Remote LATAM",
    description: "Trabajadores remotos y nómades digitales de la región",
    bannerUrl: null,
    private: false,
    followerCount: 357,
    createdAt: "2024-12-01T13:00:00.000Z",
    followedByViewer: false,
    pinnedByViewer: false,
    hiddenFromForYou: false,
    followerPreviewIds: [
      "9100000000000000003",
    ],
  },
];

export const mockListMembers: ListMember[] = [
  {
    listId: "2087605031534320824",
    userId: "1439687110030761993",
    addedAt: "2026-08-12T19:20:00.000Z",
  },
  {
    listId: "2087605031534320824",
    userId: "1149371887123873794",
    addedAt: "2026-08-12T20:20:00.000Z",
  },
  {
    listId: "2087605031534320824",
    userId: "1509287199484825606",
    addedAt: "2026-08-12T21:20:00.000Z",
  },
  {
    listId: "2087605031534320824",
    userId: "1605773190302687233",
    addedAt: "2026-08-12T22:20:00.000Z",
  },
  {
    listId: "2087605031534320824",
    userId: "2075322666668482560",
    addedAt: "2026-08-12T23:20:00.000Z",
  },
  {
    listId: "2087605031534320824",
    userId: "1937691004787916802",
    addedAt: "2026-08-13T00:20:00.000Z",
  },
  {
    listId: "2087605031534320824",
    userId: "612962800",
    addedAt: "2026-08-13T01:20:00.000Z",
  },
  {
    listId: "2095619088187124923",
    userId: "1594780041765961728",
    addedAt: "2026-09-03T22:05:00.000Z",
  },
  {
    listId: "2095619088187124923",
    userId: "1155898067339501569",
    addedAt: "2026-09-03T23:05:00.000Z",
  },
  {
    listId: "2095619088187124923",
    userId: "1514959430731075586",
    addedAt: "2026-09-04T00:05:00.000Z",
  },
  {
    listId: "2095619088187124923",
    userId: "1897655341073989632",
    addedAt: "2026-09-04T01:05:00.000Z",
  },
  {
    listId: "2095619088187124923",
    userId: "2029590208656883712",
    addedAt: "2026-09-04T02:05:00.000Z",
  },
  {
    listId: "2095619088187124923",
    userId: "41287792",
    addedAt: "2026-09-04T03:05:00.000Z",
  },
  {
    listId: "2095619088187124923",
    userId: "612962800",
    addedAt: "2026-09-04T04:05:00.000Z",
  },
  {
    listId: "2101682793479929022",
    userId: "150496130",
    addedAt: "2026-09-20T15:40:00.000Z",
  },
  {
    listId: "2101682793479929022",
    userId: "431231040",
    addedAt: "2026-09-20T16:40:00.000Z",
  },
  {
    listId: "2101682793479929022",
    userId: "1978514693368303616",
    addedAt: "2026-09-20T17:40:00.000Z",
  },
  {
    listId: "2101682793479929022",
    userId: "1965545045089792000",
    addedAt: "2026-09-20T18:40:00.000Z",
  },
  {
    listId: "2101682793479929022",
    userId: "2010031434896211968",
    addedAt: "2026-09-20T19:40:00.000Z",
  },
  {
    listId: "2101682793479929022",
    userId: "1915832869416792064",
    addedAt: "2026-09-20T20:40:00.000Z",
  },
  {
    listId: "2101682793479929022",
    userId: "1369823272871862279",
    addedAt: "2026-09-20T21:40:00.000Z",
  },
  {
    listId: "2101682793479929022",
    userId: "2298825475",
    addedAt: "2026-09-20T22:40:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "612962800",
    addedAt: "2025-11-02T13:00:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "1439687110030761993",
    addedAt: "2025-11-02T14:00:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "150496130",
    addedAt: "2025-11-02T15:00:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "431231040",
    addedAt: "2025-11-02T16:00:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "1908543248831840256",
    addedAt: "2025-11-02T17:00:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "819518729843339264",
    addedAt: "2025-11-02T18:00:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "328231382",
    addedAt: "2025-11-02T19:00:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "4846569519",
    addedAt: "2025-11-02T20:00:00.000Z",
  },
  {
    listId: "1984953635438333121",
    userId: "1087417637221601281",
    addedAt: "2025-11-02T21:00:00.000Z",
  },
  {
    listId: "1935351796334337220",
    userId: "1767536918198194176",
    addedAt: "2025-06-18T16:00:00.000Z",
  },
  {
    listId: "1935351796334337220",
    userId: "13391",
    addedAt: "2025-06-18T17:00:00.000Z",
  },
  {
    listId: "1935351796334337220",
    userId: "184650211",
    addedAt: "2025-06-18T18:00:00.000Z",
  },
  {
    listId: "1935351796334337220",
    userId: "1951021127343460352",
    addedAt: "2025-06-18T19:00:00.000Z",
  },
  {
    listId: "1935351796334337220",
    userId: "1029140973249552390",
    addedAt: "2025-06-18T20:00:00.000Z",
  },
  {
    listId: "1935351796334337220",
    userId: "2055994209534902272",
    addedAt: "2025-06-18T21:00:00.000Z",
  },
  {
    listId: "1935351796334337220",
    userId: "1390116632694042625",
    addedAt: "2025-06-18T22:00:00.000Z",
  },
  {
    listId: "1898675124436741319",
    userId: "1594780041765961728",
    addedAt: "2025-03-09T11:00:00.000Z",
  },
  {
    listId: "1898675124436741319",
    userId: "1155898067339501569",
    addedAt: "2025-03-09T12:00:00.000Z",
  },
  {
    listId: "1898675124436741319",
    userId: "41287792",
    addedAt: "2025-03-09T13:00:00.000Z",
  },
  {
    listId: "1898675124436741319",
    userId: "133668134",
    addedAt: "2025-03-09T14:00:00.000Z",
  },
  {
    listId: "1898675124436741319",
    userId: "235103150",
    addedAt: "2025-03-09T15:00:00.000Z",
  },
  {
    listId: "1898675124436741319",
    userId: "612962800",
    addedAt: "2025-03-09T16:00:00.000Z",
  },
  {
    listId: "1863206412091145418",
    userId: "328231382",
    addedAt: "2024-12-01T14:00:00.000Z",
  },
  {
    listId: "1863206412091145418",
    userId: "1798723556190113792",
    addedAt: "2024-12-01T15:00:00.000Z",
  },
  {
    listId: "1863206412091145418",
    userId: "1052399447953424386",
    addedAt: "2024-12-01T16:00:00.000Z",
  },
  {
    listId: "1863206412091145418",
    userId: "83211215",
    addedAt: "2024-12-01T17:00:00.000Z",
  },
  {
    listId: "1863206412091145418",
    userId: "810944776082178048",
    addedAt: "2024-12-01T18:00:00.000Z",
  },
];

export function toList(record: ListRecord): List | null {
  const owner = findUserById(record.ownerId);
  if (!owner) return null;

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    bannerUrl: record.bannerUrl,
    private: record.private,
    owner: toSummary(owner),
    memberCount: mockListMembers.filter((member) => member.listId === record.id)
      .length,
    followerCount: record.followerCount,
    createdAt: record.createdAt,
    followedByViewer: record.followedByViewer,
    pinnedByViewer: record.pinnedByViewer,
    hiddenFromForYou: record.hiddenFromForYou,
    followersPreview: record.followerPreviewIds.flatMap((id) => {
      const user = findUserById(id);
      return user ? [toSummary(user)] : [];
    }),
  };
}
