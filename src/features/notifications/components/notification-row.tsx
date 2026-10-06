"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import type { Notification } from "@/types/notification";
import type { Tweet } from "@/types/tweet";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import {
  FrownIcon,
  LikeActiveIcon,
  MoreHorizontalIcon,
  NotificationsActiveIcon,
  ProfileActiveIcon,
  RetweetIcon,
  SparkIcon,
  XLogoIcon,
} from "@/components/ui/icons";
import { UserBadges } from "@/components/ui/verified-badge";
import { UserHoverCard } from "@/components/user/user-hover-card";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { formatRelativeTime } from "@/utils/format-relative-time";

type RowNotification = Exclude<
  Notification,
  { type: "mention" | "reply" | "quote" }
>;

type NotificationRowProps = {
  notification: RowNotification;
  viewerHandle: string;
  unread: boolean;
};

const MAX_FACEPILE = 8;
const MENU_SIZE = { width: 180, height: 44 };

const typeIcons = {
  like: <LikeActiveIcon className="size-[30px] text-like" />,
  repost: <RetweetIcon className="size-[30px] text-repost" />,
  follow: <ProfileActiveIcon className="size-[30px] text-accent" />,
  recommendation: <SparkIcon className="size-[30px] text-spark" />,
  new_post: <NotificationsActiveIcon className="size-[30px] text-accent" />,
  login: <XLogoIcon className="size-[30px] text-foreground" />,
} satisfies Record<RowNotification["type"], ReactNode>;

function tweetHref(tweet: Tweet) {
  return routes.tweet(tweet.author.handle, tweet.id);
}

function rowHref(notification: RowNotification) {
  switch (notification.type) {
    case "follow":
      return routes.profile(notification.actors[0].handle);
    case "login":
      return routes.settingsSessions;
    default:
      return tweetHref(notification.tweet);
  }
}

function rowLabel(notification: RowNotification) {
  switch (notification.type) {
    case "follow":
      return `View ${notification.actors[0].displayName}'s profile`;
    case "login":
      return "Review login";
    default:
      return "View post";
  }
}

function formatLoginDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Actors({ users, total }: { users: UserSummary[]; total: number }) {
  const [first, second] = users;
  if (total === 2 && second) {
    return (
      <>
        <b className="font-bold">{first.displayName}</b> and{" "}
        <b className="font-bold">{second.displayName}</b>
      </>
    );
  }

  return (
    <>
      <b className="font-bold">{first.displayName}</b>
      {total > 1 ? ` and ${total - 1} ${total === 2 ? "other" : "others"}` : null}
    </>
  );
}

function Sentence({ notification }: { notification: RowNotification }) {
  switch (notification.type) {
    case "like":
    case "repost": {
      const verb = notification.type === "like" ? "liked" : "reposted";
      const target = notification.tweet.replyingTo ? "reply" : "post";
      return (
        <>
          <Actors
            users={notification.actors}
            total={notification.actorCount}
          />{" "}
          {verb} your {target}
        </>
      );
    }
    case "follow":
      return (
        <>
          <Actors
            users={notification.actors}
            total={notification.actorCount}
          />{" "}
          followed you
        </>
      );
    case "new_post":
      return (
        <>
          New post notifications for{" "}
          <b className="font-bold">{notification.author.displayName}</b>
        </>
      );
    default:
      return null;
  }
}

function Facepile({ users }: { users: UserSummary[] }) {
  return (
    <div className="flex gap-1">
      {users.slice(0, MAX_FACEPILE).map((user) => (
        <UserHoverCard key={user.id} handle={user.handle}>
          <Link href={routes.profile(user.handle)} className="relative flex">
            <Avatar src={user.avatarUrl} alt={user.displayName} size="sm" />
          </Link>
        </UserHoverCard>
      ))}
    </div>
  );
}

function SeeLessOftenButton({ onDismiss }: { onDismiss: () => void }) {
  const caretRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(caretRef, (anchor) =>
    placeOverAnchor(anchor, MENU_SIZE, "right"),
  );

  return (
    <>
      <IconButton
        ref={caretRef}
        label="More"
        data-testid="caret"
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className="absolute top-[5px] right-2"
      >
        <MoreHorizontalIcon className="size-[18.75px]" />
      </IconButton>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Notification feedback"
          style={menu.placement.style}
          origin={menu.placement.origin}
          menuClassName="rounded-xl py-0"
        >
          <MenuItem
            label="See less often"
            icon={<FrownIcon />}
            onSelect={(event) => {
              menu.selectItem(event);
              onDismiss();
            }}
          />
        </DropdownMenu>
      ) : null}
    </>
  );
}

function TweetPreview({ tweet }: { tweet: Tweet }) {
  if (!tweet.text) return null;

  return (
    <p
      data-testid="tweetText"
      className="line-clamp-3 text-base break-words whitespace-pre-line text-muted"
    >
      {tweet.text}
    </p>
  );
}

function Thumbnail({ tweet }: { tweet: Tweet }) {
  const media = tweet.media[0];
  if (!media) return null;

  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={64}
      height={64}
      className="mt-4 size-16 shrink-0 rounded-xl object-cover"
    />
  );
}

function rowContent(notification: RowNotification, viewerHandle: string) {
  switch (notification.type) {
    case "login":
      return (
        <p className="text-base">
          There was a login to your account @{viewerHandle} from a new device
          on{" "}
          <time dateTime={notification.createdAt} suppressHydrationWarning>
            {formatLoginDate(notification.createdAt)}
          </time>
          . Review it now.
        </p>
      );
    case "recommendation":
      return (
        <>
          <Facepile users={[notification.author]} />
          <div className="mt-3 flex min-w-0 items-center text-base">
            <span className="truncate font-bold">
              {notification.author.displayName}
            </span>
            <UserBadges user={notification.author} />
            <span aria-hidden className="px-1 text-muted">
              ·
            </span>
            <time
              dateTime={notification.createdAt}
              suppressHydrationWarning
              className="shrink-0 text-muted"
            >
              {formatRelativeTime(notification.createdAt)}
            </time>
          </div>
          <TweetPreview tweet={notification.tweet} />
        </>
      );
    case "new_post":
      return (
        <>
          <Facepile users={[notification.author]} />
          <p className="mt-3 text-base">
            <Sentence notification={notification} />
          </p>
          <TweetPreview tweet={notification.tweet} />
        </>
      );
    case "follow":
      return (
        <>
          <Facepile users={notification.actors} />
          <p className="mt-3 text-base">
            <Sentence notification={notification} />
          </p>
        </>
      );
    case "like":
    case "repost":
      return (
        <>
          <Facepile users={notification.actors} />
          <p className="mt-3 text-base">
            <Sentence notification={notification} />
          </p>
          <TweetPreview tweet={notification.tweet} />
        </>
      );
  }
}

export function NotificationRow({
  notification,
  viewerHandle,
  unread,
}: NotificationRowProps) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  const tweet = "tweet" in notification ? notification.tweet : null;
  const hasThumbnail = Boolean(tweet?.media.length);
  const dismissible = notification.type === "recommendation";

  return (
    <article
      data-testid="notification"
      className={cn(
        "relative flex cursor-pointer gap-2 border-b border-border px-4 py-3 transition-colors duration-200 ease-[ease]",
        unread ? "bg-accent/10 hover:bg-accent/13" : "hover:bg-white/3",
      )}
    >
      <Link
        href={rowHref(notification)}
        aria-label={rowLabel(notification)}
        className="absolute inset-0"
      />
      <div className="flex w-10 shrink-0 justify-end">
        {typeIcons[notification.type]}
      </div>
      <div
        className={cn(
          "flex min-w-0 flex-1 gap-3",
          dismissible && !hasThumbnail && "pr-10",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-col">
          {rowContent(notification, viewerHandle)}
        </div>
        {tweet && hasThumbnail ? <Thumbnail tweet={tweet} /> : null}
      </div>
      {dismissible ? (
        <SeeLessOftenButton onDismiss={() => setDismissed(true)} />
      ) : null}
    </article>
  );
}
