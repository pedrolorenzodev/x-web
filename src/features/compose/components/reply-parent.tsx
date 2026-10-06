import type { Tweet } from "@/types/tweet";
import { Avatar } from "@/components/ui/avatar";
import { UserBadges } from "@/components/ui/verified-badge";
import { TweetText } from "@/components/tweet/tweet-text";
import { formatRelativeTime } from "@/utils/format-relative-time";

export function ReplyParent({ tweet }: { tweet: Tweet }) {
  const { author } = tweet;

  return (
    <article
      aria-label={`Replying to a post by ${author.displayName}`}
      className="flex gap-2 px-4 pt-4"
    >
      <div className="flex shrink-0 flex-col items-center">
        <Avatar src={author.avatarUrl} alt={author.displayName} />
        <div aria-hidden className="mt-1 w-0.5 grow bg-border-strong" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-5 min-w-0 items-center text-base">
          <span className="truncate font-bold">{author.displayName}</span>
          <UserBadges user={author} />
          <span className="ml-1 truncate text-muted">@{author.handle}</span>
          <span aria-hidden className="px-1 text-muted">
            ·
          </span>
          <time dateTime={tweet.createdAt} className="shrink-0 text-muted">
            {formatRelativeTime(tweet.createdAt)}
          </time>
        </div>

        {tweet.text ? <TweetText text={tweet.text} className="mt-0.5" /> : null}

        <p className="pt-4 pb-3 text-base text-muted">
          Replying to <span className="text-accent">@{author.handle}</span>
        </p>
      </div>
    </article>
  );
}
