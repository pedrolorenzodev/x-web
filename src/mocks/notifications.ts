import type { Notification } from "@/types/notification";
import type { UserSummary } from "@/types/user";
import { findUserById, toSummary } from "@/mocks/users";
import { mockTweets, toTweet } from "@/mocks/tweets";

type NotificationRecordBase = {
  id: string;
  recipientId: string;
  createdAt: string;
  read: boolean;
};

export type NotificationRecord =
  | (NotificationRecordBase & {
      type: "like" | "repost";
      actorIds: string[];
      tweetId: string;
    })
  | (NotificationRecordBase & { type: "follow"; actorIds: string[] })
  | (NotificationRecordBase & {
      type: "mention" | "reply" | "quote";
      tweetId: string;
    })
  | (NotificationRecordBase & {
      type: "recommendation" | "new_post";
      tweetId: string;
    })
  | (NotificationRecordBase & {
      type: "login";
      device: string;
      location?: string;
    });

export const mockNotifications: NotificationRecord[] = [
  {
    id: "n039",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-10-05T12:02:18.000Z",
    read: false,
    tweetId: "2107067029910475920",
    actorIds: [
      "9100000000000000005",
      "9100000000000000003",
      "9100000000000000006",
    ],
  },
  {
    id: "n038",
    recipientId: "1702741923755094016",
    type: "follow",
    createdAt: "2026-10-05T09:31:44.000Z",
    read: false,
    actorIds: [
      "9100000000000000005",
    ],
  },
  {
    id: "n037",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-10-05T08:44:09.000Z",
    read: false,
    tweetId: "2106788549096391821",
    actorIds: [
      "9100000000000000004",
    ],
  },
  {
    id: "n036",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-10-04T19:20:37.000Z",
    read: true,
    tweetId: "2106788549096391821",
    actorIds: [
      "9100000000000000001",
      "9100000000000000004",
      "9100000000000000002",
      "9100000000000000005",
      "9100000000000000003",
    ],
  },
  {
    id: "n035",
    recipientId: "1702741923755094016",
    type: "reply",
    createdAt: "2026-10-04T18:05:56.000Z",
    read: true,
    tweetId: "2106808048415716514",
  },
  {
    id: "n034",
    recipientId: "1702741923755094016",
    type: "reply",
    createdAt: "2026-10-04T17:30:12.000Z",
    read: true,
    tweetId: "2106799055827936415",
  },
  {
    id: "n033",
    recipientId: "1702741923755094016",
    type: "repost",
    createdAt: "2026-10-04T17:12:01.000Z",
    read: true,
    tweetId: "2106788549096391821",
    actorIds: [
      "9100000000000000005",
    ],
  },
  {
    id: "n032",
    recipientId: "1702741923755094016",
    type: "recommendation",
    createdAt: "2026-10-04T15:03:27.000Z",
    read: true,
    tweetId: "2106727949792261306",
  },
  {
    id: "n031",
    recipientId: "1702741923755094016",
    type: "login",
    createdAt: "2026-10-04T09:12:55.000Z",
    read: true,
    device: "Chrome on macOS",
    location: "Buenos Aires, Argentina",
  },
  {
    id: "n030",
    recipientId: "1702741923755094016",
    type: "mention",
    createdAt: "2026-10-03T21:12:40.000Z",
    read: true,
    tweetId: "2106492653532136613",
  },
  {
    id: "n029",
    recipientId: "1702741923755094016",
    type: "new_post",
    createdAt: "2026-10-03T19:10:22.000Z",
    read: true,
    tweetId: "2106461875729401009",
  },
  {
    id: "n028",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-10-03T14:30:52.000Z",
    read: true,
    tweetId: "2106102457430979722",
    actorIds: [
      "9100000000000000001",
      "9100000000000000002",
      "9100000000000000005",
    ],
  },
  {
    id: "n027",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-10-02T23:59:10.000Z",
    read: true,
    tweetId: "2106102457430979722",
    actorIds: [
      "9100000000000000004",
      "9100000000000000002",
      "9100000000000000001",
      "9100000000000000006",
      "9100000000000000003",
    ],
  },
  {
    id: "n026",
    recipientId: "1702741923755094016",
    type: "quote",
    createdAt: "2026-10-02T22:47:31.000Z",
    read: true,
    tweetId: "2106154135450608811",
  },
  {
    id: "n025",
    recipientId: "1702741923755094016",
    type: "repost",
    createdAt: "2026-10-02T21:10:33.000Z",
    read: true,
    tweetId: "2106102457430979722",
    actorIds: [
      "9100000000000000005",
      "9100000000000000002",
      "9100000000000000006",
    ],
  },
  {
    id: "n024",
    recipientId: "1702741923755094016",
    type: "reply",
    createdAt: "2026-10-02T20:01:45.000Z",
    read: true,
    tweetId: "2106112418903004316",
  },
  {
    id: "n023",
    recipientId: "1702741923755094016",
    type: "follow",
    createdAt: "2026-10-02T11:05:20.000Z",
    read: true,
    actorIds: [
      "9100000000000000001",
      "9100000000000000002",
    ],
  },
  {
    id: "n022",
    recipientId: "1702741923755094016",
    type: "recommendation",
    createdAt: "2026-10-01T20:04:51.000Z",
    read: true,
    tweetId: "2105472051423359454",
  },
  {
    id: "n021",
    recipientId: "1702741923755094016",
    type: "new_post",
    createdAt: "2026-10-01T13:12:07.000Z",
    read: true,
    tweetId: "2105456412348350663",
  },
  {
    id: "n020",
    recipientId: "1702741923755094016",
    type: "recommendation",
    createdAt: "2026-10-01T02:15:38.000Z",
    read: true,
    tweetId: "2105370348057141520",
  },
  {
    id: "n019",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-09-30T10:02:44.000Z",
    read: true,
    tweetId: "2104920561284031623",
    actorIds: [
      "9100000000000000001",
      "9100000000000000004",
      "9100000000000000005",
    ],
  },
  {
    id: "n018",
    recipientId: "1702741923755094016",
    type: "new_post",
    createdAt: "2026-09-30T08:41:30.000Z",
    read: true,
    tweetId: "2105299435135934586",
  },
  {
    id: "n017",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-09-29T18:30:16.000Z",
    read: true,
    tweetId: "2104920561284031623",
    actorIds: [
      "9100000000000000005",
      "9100000000000000003",
      "9100000000000000006",
    ],
  },
  {
    id: "n016",
    recipientId: "1702741923755094016",
    type: "repost",
    createdAt: "2026-09-29T15:00:27.000Z",
    read: true,
    tweetId: "2104920561284031623",
    actorIds: [
      "9100000000000000002",
    ],
  },
  {
    id: "n015",
    recipientId: "1702741923755094016",
    type: "reply",
    createdAt: "2026-09-29T14:20:03.000Z",
    read: true,
    tweetId: "2104939263685592217",
  },
  {
    id: "n014",
    recipientId: "1702741923755094016",
    type: "follow",
    createdAt: "2026-09-28T16:40:02.000Z",
    read: true,
    actorIds: [
      "9100000000000000001",
    ],
  },
  {
    id: "n013",
    recipientId: "1702741923755094016",
    type: "recommendation",
    createdAt: "2026-09-28T01:07:13.000Z",
    read: true,
    tweetId: "2104298616592728430",
  },
  {
    id: "n012",
    recipientId: "1702741923755094016",
    type: "mention",
    createdAt: "2026-09-27T12:33:18.000Z",
    read: true,
    tweetId: "2104187623437292712",
  },
  {
    id: "n011",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-09-25T19:00:51.000Z",
    read: true,
    tweetId: "2103253430301627524",
    actorIds: [
      "9100000000000000005",
      "9100000000000000002",
      "9100000000000000003",
    ],
  },
  {
    id: "n010",
    recipientId: "1702741923755094016",
    type: "follow",
    createdAt: "2026-09-25T13:00:29.000Z",
    read: true,
    actorIds: [
      "9100000000000000003",
      "9100000000000000002",
      "9100000000000000001",
    ],
  },
  {
    id: "n009",
    recipientId: "1702741923755094016",
    type: "reply",
    createdAt: "2026-09-25T10:14:37.000Z",
    read: true,
    tweetId: "2103427946902484118",
  },
  {
    id: "n008",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2026-09-25T01:30:48.000Z",
    read: true,
    tweetId: "2103253430301627524",
    actorIds: [
      "9100000000000000005",
      "9100000000000000003",
      "9100000000000000006",
      "9100000000000000004",
      "9100000000000000001",
    ],
  },
  {
    id: "n007",
    recipientId: "1702741923755094016",
    type: "repost",
    createdAt: "2026-09-25T00:52:40.000Z",
    read: true,
    tweetId: "2103253430301627524",
    actorIds: [
      "9100000000000000004",
      "9100000000000000006",
    ],
  },
  {
    id: "n006",
    recipientId: "1702741923755094016",
    type: "reply",
    createdAt: "2026-09-24T23:02:51.000Z",
    read: true,
    tweetId: "2103258891285456019",
  },
  {
    id: "n005",
    recipientId: "1702741923755094016",
    type: "new_post",
    createdAt: "2026-09-21T13:47:02.000Z",
    read: true,
    tweetId: "2102021544239067241",
  },
  {
    id: "n004",
    recipientId: "1702741923755094016",
    type: "recommendation",
    createdAt: "2026-09-18T15:22:40.000Z",
    read: true,
    tweetId: "2100685924401295764",
  },
  {
    id: "n003",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2025-04-19T21:11:05.000Z",
    read: true,
    tweetId: "1913624884841689203",
    actorIds: [
      "9100000000000000005",
    ],
  },
  {
    id: "n002",
    recipientId: "1702741923755094016",
    type: "like",
    createdAt: "2025-04-18T23:40:19.000Z",
    read: true,
    tweetId: "1913284304265748760",
    actorIds: [
      "9100000000000000005",
      "9100000000000000003",
    ],
  },
  {
    id: "n001",
    recipientId: "1702741923755094016",
    type: "repost",
    createdAt: "2025-04-18T21:30:00.000Z",
    read: true,
    tweetId: "1913284304265748760",
    actorIds: [
      "9100000000000000005",
    ],
  },
];

const MAX_ACTORS = 8;

function toActors(actorIds: string[]): UserSummary[] {
  return actorIds.slice(0, MAX_ACTORS).flatMap((id) => {
    const user = findUserById(id);
    return user ? [toSummary(user)] : [];
  });
}

function findTweet(id: string) {
  const record = mockTweets.find((item) => item.id === id);
  return record ? toTweet(record) : null;
}

export function toNotification(
  record: NotificationRecord,
): Notification | null {
  const base = { id: record.id, createdAt: record.createdAt, read: record.read };

  switch (record.type) {
    case "follow":
      return {
        ...base,
        type: record.type,
        actors: toActors(record.actorIds),
        actorCount: record.actorIds.length,
      };
    case "like":
    case "repost": {
      const tweet = findTweet(record.tweetId);
      if (!tweet) return null;
      return {
        ...base,
        type: record.type,
        actors: toActors(record.actorIds),
        actorCount: record.actorIds.length,
        tweet,
      };
    }
    case "mention":
    case "reply":
    case "quote": {
      const tweet = findTweet(record.tweetId);
      return tweet ? { ...base, type: record.type, tweet } : null;
    }
    case "recommendation":
    case "new_post": {
      const tweet = findTweet(record.tweetId);
      if (!tweet) return null;
      return { ...base, type: record.type, author: tweet.author, tweet };
    }
    case "login":
      return {
        ...base,
        type: record.type,
        device: record.device,
        location: record.location,
      };
  }
}
