import Image from "next/image";
import type { Tweet, TweetMedia } from "@/types/tweet";
import { Avatar } from "@/components/ui/avatar";
import { RichText } from "@/components/ui/rich-text";
import { UserBadges } from "@/components/ui/verified-badge";
import { formatRelativeTime } from "@/utils/format-relative-time";
import { cn } from "@/lib/utils";

const MAX_PREVIEW_MEDIA = 4;

function QuoteMedia({ media }: { media: TweetMedia[] }) {
  if (media.length === 1) {
    const [item] = media;
    return (
      <Image
        src={item.url}
        alt={item.alt}
        width={item.width}
        height={item.height}
        sizes="516px"
        className="max-h-[510px] w-full object-cover"
      />
    );
  }

  const items = media.slice(0, MAX_PREVIEW_MEDIA);
  return (
    <div
      className={cn(
        "grid aspect-video grid-cols-2 gap-0.5",
        items.length > 2 && "grid-rows-2",
      )}
    >
      {items.map((item, index) => (
        <div
          key={item.url}
          className={cn(
            "relative",
            items.length === 3 && index === 0 && "row-span-2",
          )}
        >
          <Image
            src={item.url}
            alt={item.alt}
            fill
            sizes="258px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export function ComposeQuoteCard({ tweet }: { tweet: Tweet }) {
  const { author, media } = tweet;

  return (
    <div
      aria-label={`Quoting a post by ${author.displayName}`}
      className="mx-0.5 mt-5 overflow-hidden rounded-2xl border border-border"
    >
      <div className="mx-3 mt-3 flex h-6 min-w-0 items-center text-base">
        <Avatar
          src={author.avatarUrl}
          alt={author.displayName}
          size="xs"
          className="mr-1"
        />
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

      <div className="mx-3 mb-3">
        {tweet.text ? (
          <p className="mt-1 line-clamp-5 text-base break-words whitespace-pre-wrap">
            <RichText text={tweet.text} inert />
          </p>
        ) : null}
      </div>

      {media.length > 0 ? <QuoteMedia media={media} /> : null}
    </div>
  );
}
