import Image from "next/image";
import Link from "next/link";
import type { Tweet } from "@/types/tweet";
import { routes } from "@/config/routes";
import { MultiPhotoIcon } from "@/components/ui/icons";

export function CommunityMediaGrid({ tweets }: { tweets: Tweet[] }) {
  return (
    <div className="grid grid-cols-3 gap-1 p-1">
      {tweets.map((tweet) => {
        const [first] = tweet.media;
        return (
          <Link
            key={tweet.id}
            href={routes.tweetPhoto(tweet.author.handle, tweet.id, 1)}
            className="relative aspect-square overflow-hidden"
          >
            <Image
              src={first.url}
              alt={first.alt}
              fill
              sizes="194px"
              className="object-cover"
            />
            {tweet.media.length > 1 ? (
              <MultiPhotoIcon className="absolute right-2 bottom-2 size-5 text-white drop-shadow-[0_0_2px_rgb(0_0_0/0.5)]" />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}
