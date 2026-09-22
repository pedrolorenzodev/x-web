"use client";

import { startTransition, useOptimistic } from "react";
import type { ComponentType, SVGProps } from "react";
import type { Tweet, TweetActions as Actions } from "@/types/tweet";
import {
  BookmarkActiveIcon,
  BookmarkIcon,
  LikeActiveIcon,
  LikeIcon,
  ReplyIcon,
  RetweetActiveIcon,
  RetweetIcon,
  ShareIcon,
  ViewsIcon,
} from "@/components/ui/icons";
import { formatCount } from "@/utils/format-count";
import { deriveViews } from "@/utils/derive-views";
import { cn } from "@/lib/utils";

const tones = {
  accent: {
    active: "text-accent",
    hover: "hover:text-accent",
    circle: "group-hover/action:bg-accent/10",
  },
  repost: {
    active: "text-repost",
    hover: "hover:text-repost",
    circle: "group-hover/action:bg-repost/10",
  },
  like: {
    active: "text-like",
    hover: "hover:text-like",
    circle: "group-hover/action:bg-like/10",
  },
} as const;

const variants = {
  card: { bar: "mt-3", icon: "size-[18.75px]" },
  focal: {
    bar: "h-12 items-center border-y border-border px-1",
    icon: "size-[22.5px]",
  },
} as const;

type Variant = keyof typeof variants;

type ActionButtonProps = {
  label: string;
  variant: Variant;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: keyof typeof tones;
  count?: number;
  active?: boolean;
  onClick?: () => void;
};

function ActionButton({
  label,
  variant,
  icon: Icon,
  tone,
  count,
  active = false,
  onClick,
}: ActionButtonProps) {
  const colors = tones[tone];
  const iconSize = variants[variant].icon;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={onClick ? active : undefined}
      onClick={onClick}
      className={cn(
        "group/action relative flex h-5 items-center transition-colors duration-200 ease-[ease]",
        active ? colors.active : ["text-muted", colors.hover],
      )}
    >
      <span className={cn("relative flex", iconSize)}>
        <span
          className={cn(
            "absolute -inset-2 rounded-full transition-colors duration-200 ease-[ease]",
            colors.circle,
          )}
        />
        <Icon className={cn("relative", iconSize)} />
      </span>
      {count !== undefined && count > 0 ? (
        <span className="px-1 text-xs">{formatCount(count)}</span>
      ) : null}
    </button>
  );
}

type TweetActionsProps = {
  tweet: Tweet;
  actions: Actions;
  variant?: Variant;
};

type ToggleState = {
  liked: boolean;
  likes: number;
  retweeted: boolean;
  retweets: number;
  bookmarked: boolean;
};

type Toggle = "like" | "retweet" | "bookmark";

function applyToggle(state: ToggleState, toggle: Toggle): ToggleState {
  if (toggle === "like") {
    return {
      ...state,
      liked: !state.liked,
      likes: state.likes + (state.liked ? -1 : 1),
    };
  }
  if (toggle === "retweet") {
    return {
      ...state,
      retweeted: !state.retweeted,
      retweets: state.retweets + (state.retweeted ? -1 : 1),
    };
  }
  return { ...state, bookmarked: !state.bookmarked };
}

export function TweetActions({
  tweet,
  actions,
  variant = "card",
}: TweetActionsProps) {
  const [state, setOptimistic] = useOptimistic(
    {
      liked: tweet.likedByViewer,
      likes: tweet.stats.likes,
      retweeted: tweet.retweetedByViewer,
      retweets: tweet.stats.retweets,
      bookmarked: tweet.bookmarkedByViewer,
    },
    applyToggle,
  );

  function run(toggle: Toggle, action: (tweetId: string) => Promise<void>) {
    startTransition(async () => {
      setOptimistic(toggle);
      await action(tweet.id);
    });
  }

  const views = deriveViews(tweet);
  const focal = variant === "focal";

  return (
    <div
      role="group"
      className={cn("relative flex gap-1", variants[variant].bar)}
    >
      <div className="flex flex-1">
        <ActionButton
          variant={variant}
          label={`${tweet.stats.replies} Replies. Reply`}
          icon={ReplyIcon}
          tone="accent"
          count={tweet.stats.replies}
        />
      </div>
      <div className="flex flex-1">
        <ActionButton
          variant={variant}
          label={`${state.retweets} reposts. ${state.retweeted ? "Undo repost" : "Repost"}`}
          icon={state.retweeted ? RetweetActiveIcon : RetweetIcon}
          tone="repost"
          count={state.retweets}
          active={state.retweeted}
          onClick={() => run("retweet", actions.toggleRetweet)}
        />
      </div>
      <div className="flex flex-1">
        <ActionButton
          variant={variant}
          label={`${state.likes} Likes. ${state.liked ? "Unlike" : "Like"}`}
          icon={state.liked ? LikeActiveIcon : LikeIcon}
          tone="like"
          count={state.likes}
          active={state.liked}
          onClick={() => run("like", actions.toggleLike)}
        />
      </div>
      {focal ? null : (
        <div className="flex flex-1">
          <ActionButton
            variant={variant}
            label={`${views} views. View post analytics`}
            icon={ViewsIcon}
            tone="accent"
            count={views}
          />
        </div>
      )}
      <div className={cn("flex", focal ? "flex-1" : "mr-2")}>
        <ActionButton
          variant={variant}
          label={state.bookmarked ? "Remove Bookmark" : "Bookmark"}
          icon={state.bookmarked ? BookmarkActiveIcon : BookmarkIcon}
          tone="accent"
          active={state.bookmarked}
          onClick={() => run("bookmark", actions.toggleBookmark)}
        />
      </div>
      <div className="flex">
        <ActionButton
          variant={variant}
          label="Share post"
          icon={ShareIcon}
          tone="accent"
        />
      </div>
    </div>
  );
}
