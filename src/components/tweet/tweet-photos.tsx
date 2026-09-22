import Image from "next/image";
import type { TweetMedia } from "@/types/tweet";
import { PhotoCarousel } from "@/components/tweet/photo-carousel";

const SINGLE_MAX_HEIGHT = 510;
const BORDER = 2;

type TweetPhotosProps = {
  media: TweetMedia[];
  href: string;
};

function SinglePhoto({ photo }: { photo: TweetMedia }) {
  const frame = "mt-3 overflow-hidden rounded-2xl border border-border";

  if (photo.height > photo.width) {
    return (
      <div
        style={{
          width: (photo.width / photo.height) * SINGLE_MAX_HEIGHT,
          height: SINGLE_MAX_HEIGHT + BORDER,
        }}
        className={`relative ${frame}`}
      >
        <Image
          src={photo.url}
          alt={photo.alt}
          fill
          sizes="516px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className={frame}>
      <Image
        src={photo.url}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="516px"
        className="h-auto w-full"
      />
    </div>
  );
}

export function TweetPhotos({ media, href }: TweetPhotosProps) {
  if (media.length === 1) return <SinglePhoto photo={media[0]} />;

  return <PhotoCarousel media={media} href={href} />;
}
