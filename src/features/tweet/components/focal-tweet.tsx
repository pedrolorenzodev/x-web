import Link from "next/link";
import type { Tweet, TweetActions as Actions } from "@/types/tweet";
import type { ToggleFollow } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { GrokIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { UserBadges } from "@/components/ui/verified-badge";
import { FollowButton } from "@/components/user/follow-button";
import { UserHoverCard } from "@/components/user/user-hover-card";
import { MoreButton } from "@/components/tweet/more-button";
import { TweetActions } from "@/components/tweet/tweet-actions";
import { TweetPhotos } from "@/components/tweet/tweet-photos";
import { TweetText } from "@/components/tweet/tweet-text";
import { QuotedTweet } from "@/components/tweet/quoted-tweet";
import { LinkCard } from "@/components/tweet/link-card";
import { TweetPoll } from "@/components/tweet/tweet-poll";
import { UnavailableQuote } from "@/components/tweet/unavailable-quote";
import { formatDetailCount } from "@/utils/format-detail-count";
import { formatFullDate } from "@/utils/format-full-date";

type FocalTweetProps = {
  tweet: Tweet;
  actions: Actions;
  threaded?: boolean;
  showFollow: boolean;
  toggleFollow: ToggleFollow;
};

export function FocalTweet({
  tweet,
  actions,
  threaded = false,
  showFollow,
  toggleFollow,
}: FocalTweetProps) {
  const { author } = tweet;
  const profileHref = routes.profile(author.handle);
  const tweetHref = routes.tweet(author.handle, tweet.id);
  const hasMedia = tweet.media.length > 0 || Boolean(tweet.card);

  return (
    <article tabIndex={-1} className="px-4 outline-none">
      <div className="h-3">
        {threaded ? (
          <div className="ml-[19px] h-2 w-0.5 bg-border-strong" />
        ) : null}
      </div>

      <div className="flex items-start gap-2">
        <UserHoverCard handle={author.handle}>
          <Link href={profileHref} className="flex shrink-0">
            <Avatar src={author.avatarUrl} alt={author.displayName} />
          </Link>
        </UserHoverCard>
        <div className="flex min-w-0 flex-1 flex-col text-base">
          <UserHoverCard handle={author.handle}>
            <Link href={profileHref} className="flex min-w-0 items-center">
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
              className="truncate text-muted"
            >
              @{author.handle}
            </Link>
          </UserHoverCard>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {showFollow ? (
            <FollowButton
              userId={author.id}
              handle={author.handle}
              following={false}
              toggleFollow={toggleFollow}
            />
          ) : null}
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

      {tweet.text ? (
        <TweetText
          text={tweet.text}
          expandable={false}
          className="mt-4 text-lg leading-6"
        />
      ) : null}

      {tweet.poll ? <TweetPoll tweetId={tweet.id} poll={tweet.poll} /> : null}
      {tweet.media.length > 0 ? (
        <TweetPhotos media={tweet.media} href={tweetHref} variant="focal" />
      ) : null}
      {tweet.card && tweet.media.length === 0 ? (
        <LinkCard card={tweet.card} />
      ) : null}

      {tweet.quotedTweet ? (
        <QuotedTweet tweet={tweet.quotedTweet} variant="focal" />
      ) : null}
      {tweet.quoteUnavailable ? <UnavailableQuote className="mt-3" /> : null}

      <div className="my-4 flex flex-wrap items-center gap-1 text-base text-muted">
        <Link href={tweetHref} className="hover:underline">
          <time dateTime={tweet.createdAt} suppressHydrationWarning>
            {formatFullDate(tweet.createdAt)}
          </time>
        </Link>
        <span aria-hidden>·</span>
        <span className="text-sm">
          <span className="font-bold text-foreground">
            {formatDetailCount(tweet.stats.views)}
          </span>{" "}
          Views
        </span>
      </div>

      {tweet.editedAt ? (
        <p className="-mt-2 mb-4 text-sm text-muted">
          Last edited {formatFullDate(tweet.editedAt)}
        </p>
      ) : null}

      <TweetActions tweet={tweet} actions={actions} variant="focal" />
    </article>
  );
}
