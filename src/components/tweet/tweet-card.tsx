import Link from "next/link";
import type { ReactNode } from "react";
import type { Tweet, TweetActions as Actions } from "@/types/tweet";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { GrokIcon, PinIcon, RetweetIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { UserBadges } from "@/components/ui/verified-badge";
import { UserHoverCard } from "@/components/user/user-hover-card";
import { MoreButton } from "@/components/tweet/more-button";
import { TweetArticle } from "@/components/tweet/tweet-article";
import { TweetActions } from "@/components/tweet/tweet-actions";
import { TweetPhotos } from "@/components/tweet/tweet-photos";
import { TweetText } from "@/components/tweet/tweet-text";
import { QuotedTweet } from "@/components/tweet/quoted-tweet";
import { LinkCard } from "@/components/tweet/link-card";
import { TweetPoll } from "@/components/tweet/tweet-poll";
import { UnavailableQuote } from "@/components/tweet/unavailable-quote";
import { formatFullDate } from "@/utils/format-full-date";
import { formatRelativeTime } from "@/utils/format-relative-time";

type TweetCardProps = {
  tweet: Tweet;
  retweetedBy?: UserSummary | null;
  pinned?: boolean;
  showReplyingTo?: boolean;
  actions: Actions;
  threaded?: boolean;
};

function SocialContext({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-2 pt-2 pb-1 text-xs font-bold text-muted">
      <div className="flex w-10 shrink-0 justify-end">{icon}</div>
      {children}
    </div>
  );
}

export function TweetCard({
  tweet,
  retweetedBy = null,
  pinned = false,
  showReplyingTo = false,
  actions,
  threaded = false,
}: TweetCardProps) {
  const { author } = tweet;
  const profileHref = routes.profile(author.handle);
  const tweetHref = routes.tweet(author.handle, tweet.id);
  const hasMedia = tweet.media.length > 0 || Boolean(tweet.card);

  return (
    <TweetArticle
      className={cn(
        "relative px-4 transition-colors duration-200 ease-[ease] hover:bg-white/3",
        !threaded && "border-b border-border",
      )}
    >
      <Link
        href={tweetHref}
        aria-label={`Post by ${author.displayName}`}
        className="absolute inset-0"
      />

      {retweetedBy ? (
        <SocialContext icon={<RetweetIcon className="size-4" />}>
          <Link
            href={routes.profile(retweetedBy.handle)}
            className="relative truncate hover:underline"
          >
            {retweetedBy.displayName} reposted
          </Link>
        </SocialContext>
      ) : pinned ? (
        <SocialContext icon={<PinIcon className="size-4" />}>
          <span className="relative">Pinned</span>
        </SocialContext>
      ) : (
        <div className="h-3" />
      )}

      <div className="flex gap-2">
        <div className="flex shrink-0 flex-col items-center">
          <UserHoverCard handle={author.handle}>
            <Link href={profileHref} className="relative flex">
              <Avatar src={author.avatarUrl} alt={author.displayName} />
            </Link>
          </UserHoverCard>
          {threaded ? (
            <div className="mt-1 w-0.5 grow bg-border-strong" />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col pb-3">
          <div className="flex h-5 items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1 text-base">
              <UserHoverCard handle={author.handle}>
                <Link
                  href={profileHref}
                  className="relative flex min-w-0 items-center"
                >
                  <span className="truncate font-bold hover:underline">
                    {author.displayName}
                  </span>
                  <UserBadges user={author} />
                </Link>
              </UserHoverCard>
              <UserHoverCard handle={author.handle}>
                <Link
                  href={profileHref}
                  tabIndex={-1}
                  className="relative truncate text-muted"
                >
                  @{author.handle}
                </Link>
              </UserHoverCard>
              <span aria-hidden className="text-muted">
                ·
              </span>
              <Tooltip label={formatFullDate(tweet.createdAt)}>
                <Link
                  href={tweetHref}
                  className="relative shrink-0 text-muted hover:underline"
                >
                  <time dateTime={tweet.createdAt} suppressHydrationWarning>
                    {formatRelativeTime(tweet.createdAt)}
                  </time>
                </Link>
              </Tooltip>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {hasMedia ? (
                <Tooltip label="Explain this post">
                  <Link
                    href={routes.grok}
                    aria-label="Grok actions"
                    className="group/grok relative flex h-5 items-center text-muted transition-colors duration-200 ease-[ease] hover:text-accent"
                  >
                    <span className="absolute -inset-2 rounded-full transition-colors duration-200 ease-[ease] group-hover/grok:bg-accent/10" />
                    <GrokIcon className="relative h-5 w-[19.33px]" />
                  </Link>
                </Tooltip>
              ) : null}
              <MoreButton tweet={tweet} />
            </div>
          </div>

          {showReplyingTo && tweet.replyingTo ? (
            <p className="mt-0.5 text-base text-muted">
              Replying to{" "}
              <UserHoverCard handle={tweet.replyingTo.handle}>
                <Link
                  href={routes.profile(tweet.replyingTo.handle)}
                  className="relative text-accent hover:underline"
                >
                  @{tweet.replyingTo.handle}
                </Link>
              </UserHoverCard>
            </p>
          ) : null}

          {tweet.text ? (
            <TweetText text={tweet.text} className="mt-0.5" />
          ) : null}

          {tweet.poll ? (
            <TweetPoll tweetId={tweet.id} poll={tweet.poll} />
          ) : null}
          {tweet.media.length > 0 ? (
            <TweetPhotos media={tweet.media} href={tweetHref} />
          ) : null}
          {tweet.card && tweet.media.length === 0 ? (
            <LinkCard card={tweet.card} />
          ) : null}

          {tweet.quotedTweet ? (
            <QuotedTweet
              tweet={tweet.quotedTweet}
              condensed={tweet.media.length > 0}
            />
          ) : null}
          {tweet.quoteUnavailable ? (
            <UnavailableQuote className="mt-3" />
          ) : null}

          <TweetActions tweet={tweet} actions={actions} />
        </div>
      </div>
    </TweetArticle>
  );
}
