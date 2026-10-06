"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Page } from "@/types/pagination";
import { routes } from "@/config/routes";
import { MultiPhotoIcon } from "@/components/ui/icons";
import { SpinnerRow } from "@/components/ui/spinner";
import { getProfilePhotos } from "@/features/profile/api/get-profile-media";
import { usePagedItems } from "@/features/profile/hooks/use-paged-items";
import type { ProfilePhoto } from "@/features/profile/types/profile-photo";

type ProfilePhotoGridProps = {
  handle: string;
  firstPage: Page<ProfilePhoto>;
  empty: ReactNode;
};

function photoKey({ tweetId }: ProfilePhoto) {
  return tweetId;
}

export function ProfilePhotoGrid({
  handle,
  firstPage,
  empty,
}: ProfilePhotoGridProps) {
  const { restItems, nextCursor, sentinelRef } = usePagedItems(
    firstPage,
    (cursor, limit) => getProfilePhotos(handle, cursor, limit),
    photoKey,
  );

  if (firstPage.items.length === 0) return empty;

  return (
    <>
      <div className="grid grid-cols-3 gap-1 p-1">
        {[...firstPage.items, ...restItems].map((item) => (
          <Link
            key={photoKey(item)}
            href={routes.tweetPhoto(item.handle, item.tweetId, 1)}
            className="relative aspect-square overflow-hidden"
          >
            <Image
              src={item.photo.url}
              alt={item.photo.alt}
              fill
              sizes="194px"
              className="object-cover"
            />
            {item.count > 1 ? (
              <MultiPhotoIcon className="absolute right-2 bottom-2 size-5 text-white drop-shadow-[0_0_2px_rgb(0_0_0/0.5)]"
              />
            ) : null}
          </Link>
        ))}
      </div>
      <div ref={sentinelRef}>
        {nextCursor ? <SpinnerRow label="Loading photos" /> : null}
      </div>
    </>
  );
}
