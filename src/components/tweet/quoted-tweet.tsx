import Image from "next/image";
import Link from "next/link";
import type { QuotedTweet as QuotedTweetData, TweetMedia } from "@/types/tweet";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { PhotoCarousel } from "@/components/tweet/photo-carousel";
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
      <div
        style={{ aspectRatio: VIDEO_ASPECT_RATIO }}
        className="pointer-events-none relative mt-1 bg-black"
      >
        <Image
          src={media.url}
          alt={media.alt}
          fill
          sizes="566px"
          className="object-contain"
        />
      </div>
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
  const textClamp = replyingTo && !showCondensed ? "line-clamp-4" : "line-clamp-5";

  const replyingToLine = replyingTo ? (
    <ReplyingTo handle={replyingTo.handle} />
  ) : null;
  const text = tweet.text ? (
    <p
      className={cn(
        "text-base break-words whitespace-pre-wrap",
        showCondensed ? "mt-2" : "mt-1",
        textClamp,
      )}
    >
      {tweet.text}
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
        <span className="truncate font-bold">{author.displayName}</span>
        <span className="truncate text-muted">@{author.handle}</span>
        <span aria-hidden className="text-muted">
          ·
        </span>
        <time dateTime={tweet.createdAt} className="shrink-0 text-muted">
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
