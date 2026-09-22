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

type ActionButtonProps = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: keyof typeof tones;
  count?: number;
  active?: boolean;
  onClick?: () => void;
};

function ActionButton({
  label,
  icon: Icon,
  tone,
  count,
  active = false,
  onClick,
}: ActionButtonProps) {
  const colors = tones[tone];

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
      <span className="relative flex size-[18.75px]">
        <span
          className={cn(
            "absolute -inset-2 rounded-full transition-colors duration-200 ease-[ease]",
            colors.circle,
          )}
        />
        <Icon className="relative size-[18.75px]" />
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

export function TweetActions({ tweet, actions }: TweetActionsProps) {
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

  // TODO: views are not part of the contract, so they are derived until they are.
  const views = (tweet.stats.replies + 1) * 1337;

  return (
    <div role="group" className="relative mt-3 flex gap-1">
      <div className="flex flex-1">
        <ActionButton
          label={`${tweet.stats.replies} Replies. Reply`}
          icon={ReplyIcon}
          tone="accent"
          count={tweet.stats.replies}
        />
      </div>
      <div className="flex flex-1">
        <ActionButton
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
          label={`${state.likes} Likes. ${state.liked ? "Unlike" : "Like"}`}
          icon={state.liked ? LikeActiveIcon : LikeIcon}
          tone="like"
          count={state.likes}
          active={state.liked}
          onClick={() => run("like", actions.toggleLike)}
        />
      </div>
      <div className="flex flex-1">
        <ActionButton
          label={`${views} views. View post analytics`}
          icon={ViewsIcon}
          tone="accent"
          count={views}
        />
      </div>
      <div className="mr-2 flex">
        <ActionButton
          label={state.bookmarked ? "Remove Bookmark" : "Bookmark"}
          icon={state.bookmarked ? BookmarkActiveIcon : BookmarkIcon}
          tone="accent"
          active={state.bookmarked}
          onClick={() => run("bookmark", actions.toggleBookmark)}
        />
      </div>
      <div className="flex">
        <ActionButton label="Share post" icon={ShareIcon} tone="accent" />
      </div>
    </div>
  );
}
