import Image from "next/image";
import Link from "next/link";
import type { Tweet, TweetMedia } from "@/types/tweet";
import { routes } from "@/config/routes";
import { formatMediaDuration } from "@/features/search/utils/format-media-duration";

function mediaBadge(media: TweetMedia) {
  if (media.type !== "video") return null;
  if (media.isGif) return "GIF";
  return media.durationMs ? formatMediaDuration(media.durationMs) : null;
}

export function MediaGrid({ tweets }: { tweets: Tweet[] }) {
  const tiles = tweets.flatMap((tweet) =>
    tweet.media.map((media, index) => ({ tweet, media, index })),
  );

  return (
    <div className="grid grid-cols-3 gap-1 p-1">
      {tiles.map(({ tweet, media, index }) => {
        const badge = mediaBadge(media);
        const href =
          media.type === "photo"
            ? routes.tweetPhoto(tweet.author.handle, tweet.id, index + 1)
            : routes.tweet(tweet.author.handle, tweet.id);

        return (
          <Link
            key={`${tweet.id}-${index}`}
            href={href}
            className="relative aspect-square overflow-hidden bg-elevated"
          >
            <Image
              src={media.url}
              alt={media.alt}
              fill
              sizes="200px"
              className="object-cover transition-opacity duration-200 ease-[ease] hover:opacity-90"
            />
            {badge ? (
              <span className="absolute bottom-2 left-2 rounded-[4px] bg-black/75 px-1 py-0.5 text-xs font-bold text-white">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
