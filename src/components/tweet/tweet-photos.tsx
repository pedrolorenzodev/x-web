import Image from "next/image";
import Link from "next/link";
import type { TweetMedia } from "@/types/tweet";
import {
  PhotoCarousel,
  type PhotosVariant,
} from "@/components/tweet/photo-carousel";
import { TweetVideo } from "@/components/tweet/tweet-video";

const SINGLE_MAX_HEIGHT = 510;
const BORDER = 2;
const FRAME =
  "relative mt-3 block overflow-hidden rounded-2xl border border-border";

type TweetPhotosProps = {
  media: TweetMedia[];
  href: string;
  variant?: PhotosVariant;
};

type SinglePhotoProps = {
  photo: TweetMedia;
  href: string;
};

function portraitSize(media: TweetMedia) {
  const width = (media.width / media.height) * SINGLE_MAX_HEIGHT;
  const height = SINGLE_MAX_HEIGHT + BORDER;
  return { width, maxWidth: "100%", aspectRatio: `${width} / ${height}` };
}

function SingleVideo({ video }: { video: TweetMedia }) {
  const style =
    video.height > video.width
      ? portraitSize(video)
      : { aspectRatio: video.width / video.height };

  return (
    <TweetVideo media={video} style={style} sizes="516px" className={FRAME} />
  );
}

function SinglePhoto({ photo, href }: SinglePhotoProps) {
  if (photo.height > photo.width) {
    return (
      <Link href={href} style={portraitSize(photo)} className={FRAME}>
        <Image
          src={photo.url}
          alt={photo.alt}
          fill
          sizes="516px"
          className="object-cover"
        />
      </Link>
    );
  }

  return (
    <Link href={href} className={FRAME}>
      <Image
        src={photo.url}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes="516px"
        className="h-auto w-full"
      />
    </Link>
  );
}

export function TweetPhotos({
  media,
  href,
  variant = "card",
}: TweetPhotosProps) {
  if (media.length === 1) {
    const [item] = media;
    if (item.type === "video") return <SingleVideo video={item} />;
    return <SinglePhoto photo={item} href={`${href}/photo/1`} />;
  }

  return <PhotoCarousel media={media} href={href} variant={variant} />;
}
