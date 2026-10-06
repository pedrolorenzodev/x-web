import Image from "next/image";
import Link from "next/link";
import type { TweetMedia } from "@/types/tweet";
import {
  PhotoCarousel,
  type PhotosVariant,
} from "@/components/tweet/photo-carousel";

const SINGLE_MAX_HEIGHT = 510;
const BORDER = 2;

type TweetPhotosProps = {
  media: TweetMedia[];
  href: string;
  variant?: PhotosVariant;
};

type SinglePhotoProps = {
  photo: TweetMedia;
  href: string;
};

function SinglePhoto({ photo, href }: SinglePhotoProps) {
  const frame =
    "relative mt-3 block overflow-hidden rounded-2xl border border-border";

  if (photo.height > photo.width) {
    return (
      <Link
        href={href}
        style={{
          width: (photo.width / photo.height) * SINGLE_MAX_HEIGHT,
          height: SINGLE_MAX_HEIGHT + BORDER,
        }}
        className={frame}
      >
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
    <Link href={href} className={frame}>
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
    return <SinglePhoto photo={media[0]} href={`${href}/photo/1`} />;
  }

  return <PhotoCarousel media={media} href={href} variant={variant} />;
}
