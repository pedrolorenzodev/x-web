import Link from "next/link";
import type { Tweet, TweetActions as Actions } from "@/types/tweet";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { MoreButton } from "@/components/tweet/more-button";
import { TweetActions } from "@/components/tweet/tweet-actions";
import { TweetPhotos } from "@/components/tweet/tweet-photos";
import { deriveViews } from "@/utils/derive-views";
import { formatFullDate } from "@/utils/format-full-date";

type FocalTweetProps = {
  tweet: Tweet;
  actions: Actions;
  threaded?: boolean;
};

export function FocalTweet({
  tweet,
  actions,
  threaded = false,
}: FocalTweetProps) {
  const { author } = tweet;
  const profileHref = routes.profile(author.handle);
  const tweetHref = routes.tweet(author.handle, tweet.id);

  return (
    <article className="px-4">
      <div className="h-3">
        {threaded ? (
          <div className="ml-[19px] h-2 w-0.5 bg-border-strong" />
        ) : null}
      </div>

      <div className="flex items-start gap-2">
        <Link href={profileHref} className="flex shrink-0">
          <Avatar src={author.avatarUrl} alt={author.displayName} />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col text-base">
          <Link
            href={profileHref}
            className="truncate font-bold hover:underline"
          >
            {author.displayName}
          </Link>
          <Link
            href={profileHref}
            tabIndex={-1}
            className="truncate text-muted"
          >
            @{author.handle}
          </Link>
        </div>
        <MoreButton />
      </div>

      <p className="mt-3.5 text-lg leading-6 break-words whitespace-pre-wrap">
        {tweet.text}
      </p>

      {tweet.media.length > 0 ? (
        <TweetPhotos media={tweet.media} href={tweetHref} />
      ) : null}

      <div className="my-4 flex h-5 items-center gap-1 text-base text-muted">
        <Link href={tweetHref} className="hover:underline">
          <time dateTime={tweet.createdAt}>
            {formatFullDate(tweet.createdAt)}
          </time>
        </Link>
        <span aria-hidden>·</span>
        <span className="text-sm">
          <span className="font-bold text-foreground">
            {deriveViews(tweet).toLocaleString("en-US")}
          </span>{" "}
          Views
        </span>
      </div>

      <TweetActions tweet={tweet} actions={actions} variant="focal" />
    </article>
  );
}
