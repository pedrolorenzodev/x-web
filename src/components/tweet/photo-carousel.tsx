"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import type { ComponentType, MouseEvent, SVGProps } from "react";
import type { TweetMedia } from "@/types/tweet";
import { ArrowRightIcon, BackIcon } from "@/components/ui/icons";
import { TweetVideo } from "@/components/tweet/tweet-video";
import { cn } from "@/lib/utils";

const GAP = 4;
const PEEK_SCALE = 1.2;
const MIN_FILL_HEIGHT_RATIO = 0.37;
const MAX_HEIGHT_RATIO = 1.2444;
const FALLBACK_HEIGHT_RATIO = 0.68;
const MAX_TILE_WIDTH_RATIO = 0.8;
const TILE =
  "relative shrink-0 snap-start overflow-hidden rounded-lg border border-border";

type TileLayout = {
  height: number;
  width: (photo: TweetMedia) => number;
};

function aspect(photo: TweetMedia) {
  return photo.width / photo.height;
}

function rowLayout(media: TweetMedia[], rowWidth: number): TileLayout {
  const span = rowWidth - GAP;
  const pair = aspect(media[0]) + aspect(media[1]);
  const peeks = media.length > 2;
  const fillHeight = peeks ? ((span - 1) * PEEK_SCALE) / pair : span / pair;
  const fallbackHeight = rowWidth * FALLBACK_HEIGHT_RATIO;
  const minHeight = peeks ? fallbackHeight : rowWidth * MIN_FILL_HEIGHT_RATIO;

  if (fillHeight < minHeight) {
    const maxWidth = rowWidth * MAX_TILE_WIDTH_RATIO;
    return {
      height: fallbackHeight,
      width: (photo) => Math.min(aspect(photo) * fallbackHeight, maxWidth),
    };
  }

  const height = Math.min(fillHeight, rowWidth * MAX_HEIGHT_RATIO);
  const maxWidth = span * MAX_TILE_WIDTH_RATIO;
  return {
    height,
    width: (photo) => Math.min(aspect(photo) * height, maxWidth),
  };
}

function fixedLayout(height: number): TileLayout {
  return { height, width: (photo) => aspect(photo) * height };
}

type Variant = {
  layout: (media: TweetMedia[]) => TileLayout;
  scrollPadding: number;
  frame: string;
  list: string;
  arrows: { prev: string; next: string };
};

const variants = {
  card: {
    layout: (media) => rowLayout(media, 518),
    scrollPadding: 64,
    frame: "mt-3",
    list: "-mr-4 -ml-16 scroll-pl-16 pr-4 pl-16",
    arrows: { prev: "left-0.5", next: "right-0.5" },
  },
  focal: {
    layout: (media) => rowLayout(media, 566),
    scrollPadding: 16,
    frame: "mt-3",
    list: "-mr-4 -ml-4 scroll-pl-4 pr-4 pl-4",
    arrows: { prev: "left-0.5", next: "right-0.5" },
  },
  quote: {
    layout: () => fixedLayout(284.4),
    scrollPadding: 12,
    frame: "mt-1 mb-3",
    list: "scroll-pl-3 px-3",
    arrows: { prev: "left-3.5", next: "right-3.5" },
  },
  quoteFocal: {
    layout: () => fixedLayout(312.1),
    scrollPadding: 12,
    frame: "mt-1 mb-3",
    list: "scroll-pl-3 px-3",
    arrows: { prev: "left-3.5", next: "right-3.5" },
  },
} satisfies Record<string, Variant>;

export type PhotosVariant = keyof typeof variants;

type PhotoCarouselProps = {
  media: TweetMedia[];
  href: string;
  variant: PhotosVariant;
};

type Direction = "prev" | "next";

function offsetToTile(
  list: HTMLDivElement,
  direction: Direction,
  scrollPadding: number,
) {
  const origin = list.getBoundingClientRect().left + scrollPadding;
  const offsets = [...list.children].map(
    (tile) => tile.getBoundingClientRect().left - origin,
  );

  return direction === "next"
    ? offsets.find((offset) => offset > 1)
    : offsets.findLast((offset) => offset < -1);
}

type ArrowProps = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  visible: boolean;
  className: string;
  onClick: () => void;
};

function Arrow({ label, icon: Icon, visible, className, onClick }: ArrowProps) {
  return (
    <button
      type="button"
      aria-label={label}
      tabIndex={visible ? 0 : -1}
      onClick={onClick}
      className={cn(
        "absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-transparent bg-inverted-foreground/75 text-white backdrop-blur-[4px]",
        "transition-[opacity,background-color] duration-200 ease-[ease] hover:bg-media-control-hover/75",
        visible
          ? "opacity-0 group-hover/carousel:opacity-100 focus-visible:opacity-100"
          : "pointer-events-none opacity-0",
        className,
      )}
    >
      <Icon className="size-5" />
    </button>
  );
}

export function PhotoCarousel({ media, href, variant }: PhotoCarouselProps) {
  const config = variants[variant];
  const tile = config.layout(media);
  const router = useRouter();
  const listRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback((list: HTMLDivElement) => {
    setCanPrev(list.scrollLeft > 1);
    setCanNext(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
  }, []);

  const attachList = useCallback(
    (list: HTMLDivElement | null) => {
      listRef.current = list;
      if (list) updateArrows(list);
    },
    [updateArrows],
  );

  function openTweetFromGap(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) router.push(href);
  }

  function scroll(direction: Direction) {
    const list = listRef.current;
    if (!list) return;

    const offset = offsetToTile(list, direction, config.scrollPadding);
    if (offset !== undefined) list.scrollBy({ left: offset, behavior: "smooth" });
  }

  return (
    <div className={cn("group/carousel relative", config.frame)}>
      <div
        ref={attachList}
        onScroll={(event) => updateArrows(event.currentTarget)}
        onClick={openTweetFromGap}
        className={cn(
          "relative flex cursor-pointer snap-x snap-mandatory gap-1 overflow-x-auto [scrollbar-width:none]",
          config.list,
        )}
      >
        {media.map((photo, index) =>
          photo.type === "video" ? (
            <TweetVideo
              key={photo.url}
              media={photo}
              sizes="414px"
              style={{ width: tile.width(photo), height: tile.height }}
              className={TILE}
            />
          ) : (
            <Link
              key={photo.url}
              href={`${href}/photo/${index + 1}`}
              aria-label={`Image ${index + 1} of ${media.length}`}
              style={{ width: tile.width(photo), height: tile.height }}
              className={TILE}
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                sizes="414px"
                className="object-cover"
              />
            </Link>
          ),
        )}
      </div>

      <Arrow
        label="Previous"
        icon={BackIcon}
        visible={canPrev}
        className={config.arrows.prev}
        onClick={() => scroll("prev")}
      />
      <Arrow
        label="Next"
        icon={ArrowRightIcon}
        visible={canNext}
        className={config.arrows.next}
        onClick={() => scroll("next")}
      />
    </div>
  );
}
