import type { Tweet } from "@/types/tweet";
import type { UserSummary } from "@/types/user";

type NotificationBase = {
  id: string;
  createdAt: string;
  read: boolean;
};

export type Notification =
  | (NotificationBase & {
      type: "like" | "repost";
      actors: UserSummary[];
      actorCount: number;
      tweet: Tweet;
    })
  | (NotificationBase & {
      type: "follow";
      actors: UserSummary[];
      actorCount: number;
    })
  | (NotificationBase & {
      type: "mention" | "reply" | "quote";
      tweet: Tweet;
    })
  | (NotificationBase & {
      type: "recommendation" | "new_post";
      author: UserSummary;
      tweet: Tweet;
    })
  | (NotificationBase & {
      type: "login";
      device: string;
      location?: string;
    });

export type NotificationType = Notification["type"];

export type NotificationTab = "all" | "mentions";
