import type { NewsStory } from "@/types/news";
import { findUserById, toSummary } from "@/mocks/users";

export type NewsStoryRecord = Omit<NewsStory, "facepile"> & {
  facepileIds: string[];
};

export const mockNews: NewsStoryRecord[] = [
  {
    id: "2105757140386340624",
    headline: "Drivers question whether vehicle inspections actually measure emissions",
    category: "News",
    postCount: 3400,
    publishedAt: "2026-10-01T20:30:00.000Z",
    isTrendingNow: true,
    facepileIds: [
      "9100000000000000004",
      "9100000000000000002",
      "9100000000000000001",
    ],
    summary: "Posts on X show drivers comparing their vehicle inspection experiences across Buenos Aires. Some say emissions are never checked, while others report exhaust tests in specific cities and argue the program has helped reduce road accidents.",
    relatedUserIds: [
      "9100000000000000004",
    ],
    topTweetIds: [
      "2105710194114138426",
      "2105733973213368764",
    ],
    latestTweetIds: [
      "2105726788764619262",
      "2105715496394060083",
    ],
  },
  {
    id: "2105435017839144723",
    headline: "Desktop messaging app frustrates users with chats jumping between threads",
    category: "News",
    postCount: 12700,
    publishedAt: "2026-09-30T23:10:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000001",
      "9100000000000000004",
      "9100000000000000002",
    ],
    summary: "Users on X are sharing frustrations about a desktop messaging app that skips between conversations and loses track of unread messages. Many say they have gone back to the browser version while waiting for a fix.",
    relatedUserIds: [
      "9100000000000000001",
    ],
    topTweetIds: [
      "2105296549890953663",
    ],
    latestTweetIds: [
      "2105348388174610854",
      "2105409847068172796",
    ],
  },
  {
    id: "2096659695010348822",
    headline: "Weekend hardware hackathon in Buenos Aires crowns its winners",
    category: "News",
    postCount: 860,
    publishedAt: "2026-09-06T18:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000001",
      "9100000000000000005",
      "9100000000000000003",
    ],
    summary: "Teams spent the weekend building hardware and software projects at a local hackathon. Participants celebrated the winners on X and shared photos of the prototypes built on site.",
    relatedUserIds: [
      "9100000000000000001",
      "9100000000000000005",
    ],
    topTweetIds: [
      "2096602379810386013",
    ],
    latestTweetIds: [
      "2096629397830688974",
    ],
  },
  {
    id: "2105779789627952921",
    headline: "Developers compare how fast they burn through AI coding plans",
    category: "News",
    postCount: 5900,
    publishedAt: "2026-10-01T22:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000005",
      "9100000000000000002",
      "9100000000000000006",
    ],
    summary: "Developers are posting how quickly they use up their AI coding subscriptions, with some juggling several plans at once. The conversation mixes jokes about usage limits with tips for spending tokens more carefully.",
    relatedUserIds: [
      "9100000000000000005",
    ],
    topTweetIds: [
      "2105456412348350663",
      "2105374738998759849",
    ],
    latestTweetIds: [
      "2105406905544016153",
    ],
  },
  {
    id: "2103869703586357020",
    headline: "Remote workers across Latin America swap tips on where to base themselves",
    category: "News",
    postCount: 1900,
    publishedAt: "2026-09-26T15:30:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000005",
      "9100000000000000004",
      "9100000000000000006",
    ],
    summary: "Digital nomads and remote workers in Latin America are sharing their favourite cities to work from, weighing internet quality, cost of living and time zones.",
    relatedUserIds: [
      "9100000000000000005",
    ],
    topTweetIds: [
      "2105415800722964668",
    ],
    latestTweetIds: [
      "2105415800722964668",
    ],
  },
  {
    id: "2106731057775161119",
    headline: "Fans count down to Sunday's Superclásico at La Bombonera",
    category: "Sports",
    postCount: 48200,
    publishedAt: "2026-10-04T13:00:00.000Z",
    isTrendingNow: true,
    facepileIds: [
      "9100000000000000006",
      "9100000000000000001",
      "9100000000000000003",
    ],
    summary: "Supporters are already preparing for the weekend's Superclásico, sharing jerseys, travel plans and predictions. Talk of the match is dominating offices and group chats across the country.",
    relatedUserIds: [
      "9100000000000000006",
      "9100000000000000001",
    ],
    topTweetIds: [
      "2106727949792261306",
      "2106384318854145207",
    ],
    latestTweetIds: [
      "2106384318854145207",
    ],
  },
  {
    id: "2104647327547965218",
    headline: "Browser skateboarding game wins players over with its retro feel",
    category: "Sports",
    postCount: 2300,
    publishedAt: "2026-09-28T19:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000001",
      "9100000000000000003",
      "9100000000000000002",
    ],
    summary: "A skateboarding game that runs in the browser is drawing comparisons with classic console titles. Players are sharing high scores and asking for more parks.",
    relatedUserIds: [
      "9100000000000000001",
    ],
    topTweetIds: [
      "2104529225000853511",
    ],
    latestTweetIds: [
      "2105252241229951466",
    ],
  },
  {
    id: "2106474366370369317",
    headline: "Boca supporters debate the starting eleven ahead of the derby",
    category: "Sports",
    postCount: 31400,
    publishedAt: "2026-10-03T20:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000006",
      "9100000000000000001",
      "9100000000000000003",
    ],
    summary: "With the derby days away, Boca fans are trading lineup predictions and arguing over who should start up front.",
    relatedUserIds: [
      "9100000000000000006",
    ],
    topTweetIds: [
      "2106727949792261306",
    ],
    latestTweetIds: [
      "2106384318854145207",
    ],
  },
  {
    id: "2105628794683973416",
    headline: "Esports nostalgia: private servers of a classic online RPG fill up in minutes",
    category: "Sports",
    postCount: 4100,
    publishedAt: "2026-10-01T12:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000001",
      "9100000000000000002",
      "9100000000000000003",
    ],
    summary: "Players are flocking back to private servers of a classic online role-playing game, with slots filling within minutes of opening and towns full of returning players.",
    relatedUserIds: [
      "9100000000000000001",
    ],
    topTweetIds: [
      "2105479819924512768",
      "2105511087349412023",
    ],
    latestTweetIds: [
      "2105516280723702105",
      "2105447097431037108",
    ],
  },
  {
    id: "2096901286920777515",
    headline: "Hackathon teams treat demo day like a final",
    category: "Sports",
    postCount: 640,
    publishedAt: "2026-09-07T10:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000001",
      "9100000000000000002",
      "9100000000000000006",
    ],
    summary: "Teams at a weekend hackathon described demo day as a cup final, complete with chants, rivalries and a contested vote for the winner.",
    relatedUserIds: [
      "9100000000000000001",
    ],
    topTweetIds: [
      "2096629397830688974",
    ],
    latestTweetIds: [
      "2096602379810386013",
    ],
  },
  {
    id: "2105326804795981614",
    headline: "Album-picking site goes viral as users share the 9 records that shaped them",
    category: "Entertainment",
    postCount: 9800,
    publishedAt: "2026-09-30T16:00:00.000Z",
    isTrendingNow: true,
    facepileIds: [
      "9100000000000000004",
      "9100000000000000003",
      "9100000000000000001",
    ],
    summary: "A site that lets people choose the nine albums that defined them has generated thousands of posters in a day, with users comparing picks and debating omissions.",
    relatedUserIds: [
      "9100000000000000004",
    ],
    topTweetIds: [
      "2104662431771320490",
      "2105089993651744829",
    ],
    latestTweetIds: [
      "2104669799494148386",
    ],
  },
  {
    id: "2105402302267985713",
    headline: "A post about wearing perfume to a video interview becomes the joke of the week",
    category: "Entertainment",
    postCount: 15800,
    publishedAt: "2026-09-30T21:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000005",
      "9100000000000000002",
      "9100000000000000006",
    ],
    summary: "A short post about dressing up for a virtual job interview has been shared tens of thousands of times, with users adding their own stories of over-preparing for video calls.",
    relatedUserIds: [
      "9100000000000000005",
    ],
    topTweetIds: [
      "2105370348057141520",
    ],
    latestTweetIds: [
      "2105370348057141520",
    ],
  },
  {
    id: "2104541631087189812",
    headline: "Podcast conversation recorded inside the metaverse resurfaces",
    category: "Entertainment",
    postCount: 6400,
    publishedAt: "2026-09-28T12:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000005",
      "9100000000000000004",
      "9100000000000000006",
    ],
    summary: "An interview recorded with photorealistic avatars is circulating again, prompting fresh debate about where virtual presence is heading.",
    relatedUserIds: [
      "9100000000000000005",
    ],
    topTweetIds: [
      "1707453830344868204",
    ],
    latestTweetIds: [
      "1707467683040493616",
    ],
  },
  {
    id: "2104269840187993911",
    headline: "Animated music video about AI risk makes the rounds",
    category: "Entertainment",
    postCount: 2100,
    publishedAt: "2026-09-27T18:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000004",
      "9100000000000000005",
      "9100000000000000006",
    ],
    summary: "An animated music video exploring fears about artificial intelligence is being shared widely, with viewers praising its art direction.",
    relatedUserIds: [
      "9100000000000000004",
    ],
    topTweetIds: [
      "2104208916531892686",
    ],
    latestTweetIds: [
      "2104208916531892686",
    ],
  },
  {
    id: "2083334391202398010",
    headline: "3D-printed collectibles go from concept sketch to shelf",
    category: "Entertainment",
    postCount: 1200,
    publishedAt: "2026-07-31T23:30:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000003",
      "9100000000000000002",
      "9100000000000000005",
    ],
    summary: "Artists are showing how AI-assisted sculpting tools take a character from concept to a printable collectible figure.",
    relatedUserIds: [
      "9100000000000000003",
      "9100000000000000002",
    ],
    topTweetIds: [
      "2083329550641963094",
    ],
    latestTweetIds: [
      "2083343802094309385",
    ],
  },
  {
    id: "2100706359509602109",
    headline: "Tiny on-device automation models challenge much larger rivals",
    category: "Technology",
    postCount: 7600,
    publishedAt: "2026-09-17T22:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000003",
      "9100000000000000005",
      "9100000000000000001",
    ],
    summary: "A new family of compact automation models small enough to run on phones is drawing attention for benchmark results close to far larger models.",
    relatedUserIds: [
      "9100000000000000003",
    ],
    topTweetIds: [
      "2100685924401295764",
    ],
    latestTweetIds: [
      "2100685924401295764",
    ],
  },
  {
    id: "2104315138671206208",
    headline: "Open-source coding agents build a fan base among Argentine developers",
    category: "Technology",
    postCount: 3300,
    publishedAt: "2026-09-27T21:00:00.000Z",
    isTrendingNow: true,
    facepileIds: [
      "9100000000000000005",
      "9100000000000000006",
      "9100000000000000001",
    ],
    summary: "Developers in Argentina are meeting up around open-source coding agents, sharing workflows and photos from community weekends.",
    relatedUserIds: [
      "9100000000000000005",
    ],
    topTweetIds: [
      "2104298616592728430",
    ],
    latestTweetIds: [
      "2104320348783362351",
    ],
  },
  {
    id: "2105387202773610307",
    headline: "Developers share how they structure skills for their AI agents",
    category: "Technology",
    postCount: 2800,
    publishedAt: "2026-09-30T20:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000003",
      "9100000000000000002",
      "9100000000000000004",
    ],
    summary: "A thread about reusing agent skills sparked a discussion on whether shared skills should be adopted as-is or treated as a starting point.",
    relatedUserIds: [
      "9100000000000000003",
    ],
    topTweetIds: [
      "2105406905544016153",
    ],
    latestTweetIds: [
      "2106046547358708910",
    ],
  },
  {
    id: "2102125711983214406",
    headline: "Three.js creators show off GPU soft-body demos",
    category: "Technology",
    postCount: 1700,
    publishedAt: "2026-09-21T20:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000001",
      "9100000000000000003",
      "9100000000000000005",
    ],
    summary: "Creative developers are posting interactive 3D experiences built with Three.js, from jelly-like particles to full browser games.",
    relatedUserIds: [
      "9100000000000000001",
      "9100000000000000003",
    ],
    topTweetIds: [
      "1977708429918539973",
      "2102021544239067241",
    ],
    latestTweetIds: [
      "2106461875729401009",
    ],
  },
  {
    id: "2083976119714418505",
    headline: "Indie developers turn to X to find Android testers",
    category: "Technology",
    postCount: 900,
    publishedAt: "2026-08-02T18:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000002",
      "9100000000000000003",
      "9100000000000000004",
    ],
    summary: "Small teams launching Android apps are asking for testers on X to meet store requirements, with others offering tips on running QA rounds.",
    relatedUserIds: [
      "9100000000000000002",
    ],
    topTweetIds: [
      "2084016324762538029",
    ],
    latestTweetIds: [
      "2084304415310151737",
    ],
  },
  {
    id: "2105734491144822604",
    headline: "Gummy candy that peels in layers becomes a talking point",
    category: "Other",
    postCount: 1500,
    publishedAt: "2026-10-01T19:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000003",
      "9100000000000000006",
      "9100000000000000001",
    ],
    summary: "A peelable 3D gummy candy has people posting reviews and asking where to buy it.",
    relatedUserIds: [
      "9100000000000000003",
    ],
    topTweetIds: [
      "2105481466159206518",
    ],
    latestTweetIds: [
      "2105731788035547465",
    ],
  },
  {
    id: "2090091414946426703",
    headline: "An office robot mascot gets its own origin story",
    category: "Other",
    postCount: 700,
    publishedAt: "2026-08-19T15:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000004",
      "9100000000000000002",
      "9100000000000000001",
    ],
    summary: "A short animated film tells the tongue-in-cheek origin story of a studio's robot mascot, and employees are sharing their favourite scenes.",
    relatedUserIds: [
      "9100000000000000001",
    ],
    topTweetIds: [
      "2089865919849812091",
    ],
    latestTweetIds: [
      "2096629397830688974",
    ],
  },
  {
    id: "2105492899234430802",
    headline: "Readers turn to messaging apps to tame their reading backlog",
    category: "Other",
    postCount: 1100,
    publishedAt: "2026-10-01T03:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000005",
      "9100000000000000004",
      "9100000000000000003",
    ],
    summary: "A new service that collects saved links over chat and sends them back in print at the end of the month has readers rethinking how they save articles.",
    relatedUserIds: [
      "9100000000000000005",
    ],
    topTweetIds: [
      "2105472051423359454",
    ],
    latestTweetIds: [
      "2105483830777823273",
    ],
  },
  {
    id: "2105341904290434901",
    headline: "Spotted abroad: a familiar storefront name surprises travellers",
    category: "Other",
    postCount: 480,
    publishedAt: "2026-09-30T17:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000005",
      "9100000000000000004",
      "9100000000000000006",
    ],
    summary: "Travellers are sharing photos of shops abroad that share names with brands from home.",
    relatedUserIds: [
      "9100000000000000005",
    ],
    topTweetIds: [
      "2105415800722964668",
    ],
    latestTweetIds: [
      "2105415800722964668",
    ],
  },
  {
    id: "2105039914402439000",
    headline: "Students swap tips on pitching a thesis without freezing up",
    category: "Other",
    postCount: 530,
    publishedAt: "2026-09-29T21:00:00.000Z",
    isTrendingNow: false,
    facepileIds: [
      "9100000000000000001",
      "9100000000000000006",
      "9100000000000000002",
    ],
    summary: "Students are asking for and sharing advice on presenting a thesis, from rehearsing out loud to keeping slides short.",
    relatedUserIds: [
      "9100000000000000001",
    ],
    topTweetIds: [
      "2104772552078053654",
    ],
    latestTweetIds: [
      "2104408185708638475",
    ],
  },
];

export function toNewsStory(record: NewsStoryRecord): NewsStory {
  const { facepileIds, ...story } = record;
  return {
    ...story,
    facepile: facepileIds.flatMap((id) => {
      const user = findUserById(id);
      return user ? [toSummary(user)] : [];
    }),
  };
}
