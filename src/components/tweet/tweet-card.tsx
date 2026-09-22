import Link from "next/link";
import type { Tweet, TweetActions as Actions } from "@/types/tweet";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { MoreHorizontalIcon, RetweetIcon } from "@/components/ui/icons";
import { TweetActions } from "@/components/tweet/tweet-actions";
import { formatRelativeTime } from "@/utils/format-relative-time";

type TweetCardProps = {
  tweet: Tweet;
  retweetedBy?: UserSummary | null;
  actions: Actions;
};

export function TweetCard({ tweet, retweetedBy = null, actions }: TweetCardProps) {
  const { author } = tweet;
  const profileHref = routes.profile(author.handle);
  const tweetHref = routes.tweet(author.handle, tweet.id);

  return (
    <article className="relative border-b border-border px-4 transition-colors duration-200 ease-[ease] hover:bg-white/3">
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
        <Link href={profileHref} className="relative h-fit shrink-0">
          <Avatar src={author.avatarUrl} alt={author.displayName} />
        </Link>

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

            <button
              type="button"
              aria-label="More"
              className="group/more relative flex h-5 shrink-0 items-center text-muted transition-colors duration-200 ease-[ease] hover:text-accent"
            >
              <span className="relative flex size-[18.75px]">
                <span className="absolute -inset-2 rounded-full transition-colors duration-200 ease-[ease] group-hover/more:bg-accent/10" />
                <MoreHorizontalIcon className="relative size-[18.75px]" />
              </span>
            </button>
          </div>

          <p className="mt-0.5 text-base break-words whitespace-pre-wrap">
            {tweet.text}
          </p>

          <TweetActions tweet={tweet} actions={actions} />
        </div>
      </div>
    </article>
  );
}
