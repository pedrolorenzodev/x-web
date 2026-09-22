import Link from "next/link";
import type { Tweet, TweetActions as Actions } from "@/types/tweet";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { RetweetIcon } from "@/components/ui/icons";
import { MoreButton } from "@/components/tweet/more-button";
import { TweetActions } from "@/components/tweet/tweet-actions";
import { TweetPhotos } from "@/components/tweet/tweet-photos";
import { formatRelativeTime } from "@/utils/format-relative-time";

type TweetCardProps = {
  tweet: Tweet;
  retweetedBy?: UserSummary | null;
  actions: Actions;
  threaded?: boolean;
};

export function TweetCard({
  tweet,
  retweetedBy = null,
  actions,
  threaded = false,
}: TweetCardProps) {
  const { author } = tweet;
  const profileHref = routes.profile(author.handle);
  const tweetHref = routes.tweet(author.handle, tweet.id);

  return (
    <article
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
        <div className="flex gap-2 pt-3 pb-1 text-xs font-bold text-muted">
          <div className="flex w-10 shrink-0 justify-end">
            <RetweetIcon className="size-4" />
          </div>
          <Link
            href={routes.profile(retweetedBy.handle)}
            className="relative truncate hover:underline"
          >
            {retweetedBy.displayName} reposted
          </Link>
        </div>
      ) : (
        <div className="h-3" />
      )}

      <div className="flex gap-2">
        <div className="flex shrink-0 flex-col items-center">
          <Link href={profileHref} className="relative flex">
            <Avatar src={author.avatarUrl} alt={author.displayName} />
          </Link>
          {threaded ? <div className="mt-1 w-0.5 grow bg-border-strong" /> : null}
        </div>

        <div className="flex min-w-0 flex-1 flex-col pb-3">
          <div className="flex h-5 items-start justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1 text-base">
              <Link
                href={profileHref}
                className="relative truncate font-bold hover:underline"
              >
                {author.displayName}
              </Link>
              <Link
                href={profileHref}
                tabIndex={-1}
                className="relative truncate text-muted"
              >
                @{author.handle}
              </Link>
              <span aria-hidden className="text-muted">
                ·
              </span>
              <Link
                href={tweetHref}
                className="relative shrink-0 text-muted hover:underline"
              >
                <time dateTime={tweet.createdAt}>
                  {formatRelativeTime(tweet.createdAt)}
                </time>
              </Link>
            </div>

            <MoreButton />
          </div>

          <p className="mt-0.5 text-base break-words whitespace-pre-wrap">
            {tweet.text}
          </p>

          {tweet.media.length > 0 ? (
            <TweetPhotos media={tweet.media} href={tweetHref} />
          ) : null}

          <TweetActions tweet={tweet} actions={actions} />
        </div>
      </div>
    </article>
  );
}
