import Image from "next/image";
import Link from "next/link";
import type {
  NestedQuote,
  QuotedTweet as QuotedTweetData,
  TweetMedia,
} from "@/types/tweet";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { RichText } from "@/components/ui/rich-text";
import { UserBadges } from "@/components/ui/verified-badge";
import { MediaBadge } from "@/components/tweet/media-badge";
import { PhotoCarousel } from "@/components/tweet/photo-carousel";
import { TweetVideo } from "@/components/tweet/tweet-video";
import { UnavailableQuote } from "@/components/tweet/unavailable-quote";
import { formatDuration } from "@/utils/format-duration";
import { formatRelativeTime } from "@/utils/format-relative-time";

const VIDEO_ASPECT_RATIO = 16 / 9;

type QuotedTweetProps = {
  tweet: QuotedTweetData;
  variant?: "card" | "focal";
  condensed?: boolean;
};

function ReplyingTo({ handle }: { handle: string }) {
  return (
    <p className="mt-1 text-base text-muted">
      Replying to <span>@{handle}</span>
    </p>
  );
}

function SingleMedia({ media }: { media: TweetMedia }) {
  if (media.type === "video") {
    return (
      <TweetVideo
        media={media}
        sizes="566px"
        style={{ aspectRatio: VIDEO_ASPECT_RATIO }}
        className="mt-1"
      />
    );
  }

  return (
    <Image
      src={media.url}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes="566px"
      className="pointer-events-none mt-1 h-auto w-full"
    />
  );
}

const condensedGrids: Record<number, string[]> = {
  1: ["col-span-2 row-span-2"],
  2: ["row-span-2", "row-span-2"],
  3: ["row-span-2", "", ""],
  4: ["", "", "", ""],
};

function videoBadge(media: TweetMedia) {
  if (media.type !== "video") return null;
  if (media.isGif) return "GIF";
  return media.durationMs ? formatDuration(media.durationMs / 1000) : null;
}

function NestedQuotePreview({ quote }: { quote: NestedQuote }) {
  const { author, thumbnail } = quote;

  return (
    <Link
      href={routes.tweet(author.handle, quote.id)}
      aria-label={`Quoted post by ${author.displayName}`}
      data-testid="nestedQuotePreview"
      className="relative mx-3 mb-3 flex flex-col gap-1 rounded-xl border border-border bg-white/3 p-3 text-base"
    >
      <div className="flex h-5 min-w-0 items-center gap-1">
        <Avatar src={author.avatarUrl} alt={author.displayName} size="xs" />
        <span className="flex min-w-0 items-center">
          <span className="truncate font-bold">{author.displayName}</span>
          <UserBadges user={author} />
        </span>
        <span className="truncate text-muted">@{author.handle}</span>
        <span aria-hidden className="text-muted">
          ·
        </span>
        <time
          dateTime={quote.createdAt}
          suppressHydrationWarning
          className="shrink-0 text-muted"
        >
          {formatRelativeTime(quote.createdAt)}
        </time>
      </div>
      <div className="flex min-w-0 gap-2">
        {thumbnail ? (
          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={thumbnail.url}
              alt={thumbnail.alt}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
        ) : null}
        {quote.text ? (
          <p className="line-clamp-3 min-w-0 break-words whitespace-pre-wrap">
            <RichText text={quote.text} inert />
          </p>
        ) : null}
      </div>
    </Link>
  );
}

function CondensedMedia({ media }: { media: TweetMedia[] }) {
  const cells = condensedGrids[media.length] ?? condensedGrids[4];

  return (
    <div className="pointer-events-none mt-2 mb-3 aspect-square shrink-0 basis-1/5 overflow-hidden rounded-2xl border border-border">
      <div className="grid size-full grid-cols-2 grid-rows-2 gap-0.5">
        {media.slice(0, 4).map((item, index) => (
          <div key={item.url} className={cn("relative", cells[index])}>
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes="100px"
              className="object-cover"
            />
            {media.length === 1 && videoBadge(item) ? (
              <MediaBadge
                tone={item.isGif ? "label" : "info"}
                className="absolute bottom-1 left-1 h-4 px-1"
              >
                {videoBadge(item)}
              </MediaBadge>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function QuotedTweet({
  tweet,
  variant = "card",
  condensed = false,
}: QuotedTweetProps) {
  const { author, replyingTo, media } = tweet;
  const tweetHref = routes.tweet(author.handle, tweet.id);
  const showCondensed = condensed && media.length > 0;
  const textClamp =
    replyingTo && !showCondensed ? "line-clamp-4" : "line-clamp-5";

  const replyingToLine = replyingTo ? (
    <ReplyingTo handle={replyingTo.handle} />
  ) : null;
  const nested = tweet.nestedQuote ? (
    <NestedQuotePreview quote={tweet.nestedQuote} />
  ) : tweet.nestedQuoteUnavailable ? (
    <UnavailableQuote className="mx-3 mb-3" />
  ) : null;
  const text = tweet.text ? (
    <p
      className={cn(
        "text-base break-words whitespace-pre-wrap",
        showCondensed ? "mt-2" : "mt-1",
        textClamp,
      )}
    >
      <RichText text={tweet.text} inert />
    </p>
  ) : null;

  return (
    <div className="relative mt-3 flex flex-col overflow-hidden rounded-2xl border border-border transition-colors duration-200 ease-[ease] hover:bg-white/3">
      <Link
        href={tweetHref}
        aria-label={`Quoted post by ${author.displayName}`}
        className="absolute inset-0"
      />

      <div className="mx-3 mt-3 flex h-6 min-w-0 items-center gap-1 text-base">
        <Avatar src={author.avatarUrl} alt={author.displayName} size="xs" />
        <span className="flex min-w-0 items-center">
          <span className="truncate font-bold">{author.displayName}</span>
          <UserBadges user={author} />
        </span>
        <span className="truncate text-muted">@{author.handle}</span>
        <span aria-hidden className="text-muted">
          ·
        </span>
        <time
          dateTime={tweet.createdAt}
          suppressHydrationWarning
          className="shrink-0 text-muted"
        >
          {formatRelativeTime(tweet.createdAt)}
        </time>
      </div>

      {showCondensed ? (
        <div className="flex pl-3">
          <CondensedMedia media={media} />
          <div className="mx-3 mb-3 min-w-0 flex-1">
            {replyingToLine}
            {text}
          </div>
        </div>
      ) : (
        <>
          <div className="mx-3 mb-3">
            {replyingToLine}
            {text}
          </div>
          {nested}
          {media.length === 1 ? <SingleMedia media={media[0]} /> : null}
          {media.length > 1 ? (
            <PhotoCarousel
              media={media}
              href={tweetHref}
              variant={variant === "focal" ? "quoteFocal" : "quote"}
            />
          ) : null}
        </>
      )}
    </div>
  );
}
