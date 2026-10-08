import type {
  Community,
  CommunityRole,
  CommunityRule,
  CommunityTopic,
} from "@/types/community";
import { findUserById, toSummary, type UserRecord } from "@/mocks/users";

export type CommunityRecord = {
  id: string;
  name: string;
  description: string;
  bannerUrl: string;
  category: string;
  topic: CommunityTopic;
  memberCount: number;
  hashtags: string[];
  rules: CommunityRule[];
  joinPolicy: "open" | "request";
  createdAt: string;
  createdById: string;
  members: { userId: string; role: CommunityRole }[];
  pinnedBy: string[];
};

const FACEPILE_SIZE = 5;

const respectfulRule: CommunityRule = {
  title: "Be respectful",
  description:
    "Disagree with ideas, not people. Harassment and personal attacks get removed.",
};

const onTopicRule = (topic: string): CommunityRule => ({
  title: "Keep content on-topic",
  description: `Posts, replies and quotes should be about ${topic}. Off-topic content will be removed.`,
});

const noSpamRule: CommunityRule = {
  title: "No spam or self-promotion",
  description:
    "Sharing your own work is welcome when it adds to the conversation. Repeated promos and link drops are not.",
};

export const mockCommunities: CommunityRecord[] = [
  {
    id: "1849210465730215936",
    name: "Next.js Builders",
    description:
      "A place for people shipping with Next.js and React. Show what you built, ask for feedback and share what you learned along the way.",
    bannerUrl: "/media/laptop-dark.jpg",
    category: "Software",
    topic: "Technology",
    memberCount: 48200,
    hashtags: ["NextJS", "React", "BuildInPublic", "WebDev", "TypeScript"],
    rules: [
      respectfulRule,
      onTopicRule("building for the web"),
      {
        title: "Share code, not screenshots of code",
        description:
          "When you ask for help, paste a minimal snippet or a repo link so others can actually run it.",
      },
      noSpamRule,
    ],
    joinPolicy: "open",
    createdAt: "2024-10-24T15:00:00.000Z",
    createdById: "9100000000000000002",
    members: [
      { userId: "9100000000000000002", role: "admin" },
      { userId: "9100000000000000001", role: "moderator" },
      { userId: "150496130", role: "member" },
      { userId: "612962800", role: "member" },
      { userId: "14154963", role: "member" },
      { userId: "1605773190302687233", role: "member" },
      { userId: "1741957303723610112", role: "member" },
      { userId: "1155898067339501569", role: "member" },
      { userId: "9100000000000000003", role: "member" },
    ],
    pinnedBy: [],
  },
  {
    id: "1851977320413958144",
    name: "AI Engineers LATAM",
    description:
      "Engineers across Latin America building with LLMs, agents and on-device models. Papers, demos and honest takes on what works in production.",
    bannerUrl: "/media/laptop-notebook.jpg",
    category: "Artificial Intelligence",
    topic: "Technology",
    memberCount: 21700,
    hashtags: ["AI", "Agents", "LLM", "MachineLearning", "OpenSource"],
    rules: [
      respectfulRule,
      onTopicRule("AI engineering"),
      {
        title: "Cite your sources",
        description:
          "Benchmarks and claims should link to the paper, repo or eval they come from.",
      },
      noSpamRule,
    ],
    joinPolicy: "open",
    createdAt: "2025-03-11T18:30:00.000Z",
    createdById: "9100000000000000006",
    members: [
      { userId: "9100000000000000006", role: "admin" },
      { userId: "9100000000000000004", role: "moderator" },
      { userId: "1978514693368303616", role: "member" },
      { userId: "2029590208656883712", role: "member" },
      { userId: "1965545045089792000", role: "member" },
      { userId: "427089628", role: "member" },
      { userId: "150496130", role: "member" },
      { userId: "9100000000000000005", role: "member" },
    ],
    pinnedBy: [],
  },
  {
    id: "1838546109921034240",
    name: "Design Systems Club",
    description:
      "Tokens, components, docs and the people who maintain them. Critique welcome, gatekeeping not.",
    bannerUrl: "/media/laptop-cafe.jpg",
    category: "Design",
    topic: "Art",
    memberCount: 12900,
    hashtags: ["DesignSystems", "UIUX", "Figma", "CSS", "Accessibility"],
    rules: [
      respectfulRule,
      onTopicRule("design systems and interface design"),
      {
        title: "Attribute creative work",
        description:
          "Give credit to the original authors. Don’t post work you didn’t make without saying where it came from.",
      },
      {
        title: "Include design context",
        description:
          "When sharing a component or a screen, say what problem it solves and what constraints you had.",
      },
    ],
    joinPolicy: "open",
    createdAt: "2024-09-02T13:00:00.000Z",
    createdById: "9100000000000000001",
    members: [
      { userId: "9100000000000000001", role: "admin" },
      { userId: "9100000000000000005", role: "moderator" },
      { userId: "1594780041765961728", role: "member" },
      { userId: "1439687110030761993", role: "member" },
      { userId: "1509287199484825606", role: "member" },
      { userId: "9100000000000000004", role: "member" },
    ],
    pinnedBy: [],
  },
  {
    id: "1862140973559504896",
    name: "Landscape Photography",
    description:
      "Mountains, valleys and the light that makes them. Post your best shot of the week and tell us where it was taken.",
    bannerUrl: "/media/valley-cliffs.jpg",
    category: "Photography",
    topic: "Art",
    memberCount: 86400,
    hashtags: ["Landscape", "Photography", "Patagonia", "GoldenHour", "Nature"],
    rules: [
      respectfulRule,
      {
        title: "Only your own photos",
        description:
          "Every photo you post must be yours. Reposting other photographers’ work gets removed.",
      },
      {
        title: "Say where it was taken",
        description: "Add the location, even if it’s just the region.",
      },
    ],
    joinPolicy: "open",
    createdAt: "2023-11-20T10:00:00.000Z",
    createdById: "9100000000000000003",
    members: [
      { userId: "9100000000000000003", role: "admin" },
      { userId: "9100000000000000001", role: "member" },
      { userId: "1281715860726517766", role: "member" },
      { userId: "1915832869416792064", role: "member" },
      { userId: "1572819212757864448", role: "member" },
    ],
    pinnedBy: [],
  },
  {
    id: "1867902554183528448",
    name: "Trekking Patagonia",
    description:
      "Routes, gear lists and weather reports from the south. Plan your next trek with people who have done it.",
    bannerUrl: "/media/snow-camp.jpg",
    category: "Hiking",
    topic: "Travel",
    memberCount: 9300,
    hashtags: ["Trekking", "Patagonia", "ElChalten", "Camping", "Outdoors"],
    rules: [
      respectfulRule,
      onTopicRule("trekking and outdoor travel"),
      {
        title: "Leave no trace",
        description:
          "Don’t share routes through protected areas that are closed to the public.",
      },
    ],
    joinPolicy: "open",
    createdAt: "2025-01-15T12:00:00.000Z",
    createdById: "9100000000000000005",
    members: [
      { userId: "9100000000000000005", role: "admin" },
      { userId: "9100000000000000003", role: "moderator" },
      { userId: "1149371887123873794", role: "member" },
      { userId: "1897655341073989632", role: "member" },
      { userId: "9100000000000000002", role: "member" },
    ],
    pinnedBy: [],
  },
  {
    id: "1873390147200319488",
    name: "Pug Lovers",
    description:
      "Snorts, naps and blankets. A wholesome corner for everyone who shares their home with a pug.",
    bannerUrl: "/media/pug-blanket.jpg",
    category: "Dogs",
    topic: "Animals",
    memberCount: 154000,
    hashtags: ["Pugs", "DogsOfX", "PugLife", "Caturday"],
    rules: [
      respectfulRule,
      onTopicRule("pugs and the people who love them"),
      {
        title: "No breeding or selling posts",
        description: "Adoption posts are welcome. Sales and breeding ads are not.",
      },
    ],
    joinPolicy: "open",
    createdAt: "2024-06-08T09:00:00.000Z",
    createdById: "9100000000000000004",
    members: [
      { userId: "9100000000000000004", role: "admin" },
      { userId: "9100000000000000006", role: "moderator" },
      { userId: "1767536918198194176", role: "member" },
      { userId: "1950610254577991680", role: "member" },
      { userId: "1572819212757864448", role: "member" },
      { userId: "9100000000000000001", role: "member" },
    ],
    pinnedBy: [],
  },
];

export const communitiesWelcomeDismissedBy = new Set<string>();

function hasRealAvatar(user: UserRecord) {
  return !user.avatarUrl.startsWith("/avatars/");
}

export function findCommunity(id: string) {
  return mockCommunities.find((community) => community.id === id) ?? null;
}

export function toCommunity(
  record: CommunityRecord,
  viewerId: string | null,
): Community | null {
  const createdBy = findUserById(record.createdById);
  if (!createdBy) return null;

  const members = record.members.flatMap(({ userId }) => {
    const user = findUserById(userId);
    return user && user.id !== viewerId ? [user] : [];
  });
  const membersPreview = [
    ...members.filter(hasRealAvatar),
    ...members.filter((user) => !hasRealAvatar(user)),
  ]
    .slice(0, FACEPILE_SIZE)
    .map(toSummary);

  return {
    id: record.id,
    name: record.name,
    description: record.description,
    bannerUrl: record.bannerUrl,
    category: record.category,
    topic: record.topic,
    memberCount: record.memberCount,
    membersPreview,
    hashtags: record.hashtags,
    rules: record.rules,
    joinPolicy: record.joinPolicy,
    createdAt: record.createdAt,
    createdBy: toSummary(createdBy),
    viewerRole:
      record.members.find((member) => member.userId === viewerId)?.role ?? null,
    pinnedByViewer: viewerId ? record.pinnedBy.includes(viewerId) : false,
  };
}
