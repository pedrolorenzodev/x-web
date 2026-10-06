"use client";

import {
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import type { ComponentType, MouseEvent, Ref, SVGProps } from "react";
import type { Tweet, TweetActions as Actions } from "@/types/tweet";
import { routes } from "@/config/routes";
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
import { AnimatedCount } from "@/components/ui/animated-count";
import { showToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { createLikeBurst, type LikeBurst } from "@/components/tweet/like-burst";
import { placeRepostMenu, RepostMenu } from "@/components/tweet/repost-menu";
import { placeShareMenu, ShareMenu } from "@/components/tweet/share-menu";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { formatCount } from "@/utils/format-count";
import { cn } from "@/lib/utils";

const tones = {
  accent: {
    active: "text-accent",
    hover: "hover:text-accent",
    circle: "bg-accent/10",
  },
  repost: {
    active: "text-repost",
    hover: "hover:text-repost",
    circle: "bg-repost/10",
  },
  like: {
    active: "text-like",
    hover: "hover:text-like",
    circle: "bg-like/10",
  },
} as const;

const variants = {
  card: { bar: "mt-3", icon: "size-[18.75px]", idle: "text-muted" },
  focal: {
    bar: "h-12 items-center border-t border-border px-1",
    icon: "size-[22.5px]",
    idle: "text-muted",
  },
  viewer: {
    bar: "h-12 items-center px-3",
    icon: "size-[22.5px]",
    idle: "text-foreground",
  },
} as const;

type Variant = keyof typeof variants;

type ActionButtonProps = {
  label: string;
  tooltip: string;
  href?: string;
  variant: Variant;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  activeIcon?: ComponentType<SVGProps<SVGSVGElement>>;
  swapIcons?: boolean;
  tone: keyof typeof tones;
  count?: number;
  active?: boolean;
  celebrate?: boolean;
  expanded?: boolean;
  ref?: Ref<HTMLButtonElement>;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
};

function ActionButton({
  label,
  tooltip,
  href,
  variant,
  icon: Icon,
  activeIcon: ActiveIcon = Icon,
  swapIcons = false,
  tone,
  count,
  active = false,
  celebrate = false,
  expanded,
  ref,
  onClick,
}: ActionButtonProps) {
  const colors = tones[tone];
  const iconSize = variants[variant].icon;
  const [burst, setBurst] = useState<LikeBurst | null>(null);

  useEffect(() => {
    if (!burst) return;
    const timeout = window.setTimeout(() => setBurst(null), burst.duration);
    return () => window.clearTimeout(timeout);
  }, [burst]);

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (celebrate && !active) setBurst(createLikeBurst((burst?.id ?? 0) + 1));
    onClick?.(event);
  }

  const hasMenu = expanded !== undefined;

  const className = cn(
    "group/action pointer-events-auto relative flex h-5 items-center transition-colors",
    active ? colors.active : [variants[variant].idle, colors.hover],
    celebrate && "t-like",
    burst && "is-bursting",
  );

  const content = (
    <>
      <span className={cn("relative flex", iconSize)}>
        <span
          className={cn(
            "absolute -inset-2 scale-[0.88] rounded-full opacity-0 transition-[opacity,scale] duration-[140ms] ease-[ease-out] group-hover/action:scale-100 group-hover/action:opacity-100 motion-reduce:transition-none",
            colors.circle,
          )}
        />
        {swapIcons ? (
          <span className="t-icon-swap" data-state={active ? "b" : "a"}>
            <span className="t-icon flex" data-icon="a">
              <Icon className={iconSize} />
            </span>
            <span className="t-icon flex" data-icon="b">
              <ActiveIcon className={iconSize} />
            </span>
          </span>
        ) : (
          <span
            key={`icon-${burst?.id}`}
            className={cn("relative flex", celebrate && "t-like-icon")}
          >
            {active ? (
              <ActiveIcon className={iconSize} />
            ) : (
              <Icon className={iconSize} />
            )}
          </span>
        )}
        {burst ? (
          <span key={`particles-${burst.id}`} className="t-like-particles">
            {burst.particles.map((style, index) => (
              <i key={index} style={style} />
            ))}
          </span>
        ) : null}
      </span>
      {count !== undefined ? (
        <AnimatedCount value={count} format={formatCount} className="px-1 text-xs" />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Tooltip label={tooltip}>
        <Link href={href} scroll={false} aria-label={label} className={className}>
          {content}
        </Link>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={tooltip}>
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-pressed={onClick && !hasMenu ? active : undefined}
        aria-haspopup={hasMenu ? "menu" : undefined}
        aria-expanded={expanded}
        onClick={handleClick}
        className={className}
      >
        {content}
      </button>
    </Tooltip>
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
  bookmarks: number;
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
  return {
    ...state,
    bookmarked: !state.bookmarked,
    bookmarks: state.bookmarks + (state.bookmarked ? -1 : 1),
  };
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
      bookmarks: tweet.stats.bookmarks,
    },
    applyToggle,
  );

  function run(toggle: Toggle, action: (tweetId: string) => Promise<void>) {
    startTransition(async () => {
      setOptimistic(toggle);
      await action(tweet.id);
    });
  }

  const repostRef = useRef<HTMLButtonElement>(null);
  const repostMenu = useDropdownMenu(repostRef, placeRepostMenu);
  const shareRef = useRef<HTMLButtonElement>(null);
  const shareMenu = useDropdownMenu(shareRef, placeShareMenu);
  const tweetHref = routes.tweet(tweet.author.handle, tweet.id);

  function toggleBookmark() {
    showToast(
      state.bookmarked
        ? { message: "Removed from your Bookmarks" }
        : {
            message: "Added to your Bookmarks",
            action: { label: "Add to Folder", href: routes.premium },
          },
    );
    run("bookmark", actions.toggleBookmark);
  }

  const views = tweet.stats.views;
  const focal = variant === "focal";
  const viewer = variant === "viewer";

  return (
    <div
      role="group"
      className={cn(
        "pointer-events-none relative flex gap-1",
        variants[variant].bar,
      )}
    >
      <div className="flex flex-1">
        <ActionButton
          variant={variant}
          label={`${tweet.stats.replies} Replies. Reply`}
          tooltip="Reply"
          href={routes.composeReply(tweet.id)}
          icon={ReplyIcon}
          tone="accent"
          count={tweet.stats.replies}
        />
      </div>
      <div className="flex flex-1">
        <ActionButton
          variant={variant}
          label={`${state.retweets} reposts. ${state.retweeted ? "Undo repost" : "Repost"}`}
          tooltip={state.retweeted ? "Undo repost" : "Repost"}
          icon={RetweetIcon}
          activeIcon={RetweetActiveIcon}
          swapIcons
          tone="repost"
          count={state.retweets}
          active={state.retweeted}
          expanded={repostMenu.isOpen}
          ref={repostRef}
          onClick={repostMenu.toggle}
        />
        <RepostMenu
          menu={repostMenu}
          retweeted={state.retweeted}
          quoteHref={routes.composeQuote(tweet.id)}
          onRepost={() => run("retweet", actions.toggleRetweet)}
        />
      </div>
      <div className="flex flex-1">
        <ActionButton
          variant={variant}
          label={`${state.likes} Likes. ${state.liked ? "Unlike" : "Like"}`}
          tooltip={state.liked ? "Unlike" : "Like"}
          icon={LikeIcon}
          activeIcon={LikeActiveIcon}
          tone="like"
          count={state.likes}
          active={state.liked}
          celebrate
          onClick={() => run("like", actions.toggleLike)}
        />
      </div>
      {focal ? null : (
        <div className="flex flex-1">
          <ActionButton
            variant={variant}
            label={`${views} views. View post analytics`}
            tooltip="View"
            href={`${tweetHref}/analytics`}
            icon={ViewsIcon}
            tone="accent"
            count={views}
          />
        </div>
      )}
      {viewer ? null : (
        <div className={cn("flex", focal ? "flex-1" : "mr-2")}>
          <ActionButton
            variant={variant}
            label={state.bookmarked ? "Remove Bookmark" : "Bookmark"}
            tooltip="Bookmark"
            count={focal ? state.bookmarks : undefined}
            icon={BookmarkIcon}
            activeIcon={BookmarkActiveIcon}
            swapIcons
            tone="accent"
            active={state.bookmarked}
            onClick={toggleBookmark}
          />
        </div>
      )}
      <div className="flex">
        <ActionButton
          variant={variant}
          label="Share post"
          tooltip="Share"
          icon={ShareIcon}
          tone="accent"
          expanded={shareMenu.isOpen}
          ref={shareRef}
          onClick={shareMenu.toggle}
        />
        <ShareMenu menu={shareMenu} path={tweetHref} />
      </div>
    </div>
  );
}
