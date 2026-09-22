"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import type { ComponentType, MouseEvent, SVGProps } from "react";
import type { TweetMedia } from "@/types/tweet";
import { ArrowRightIcon, BackIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const TILE_HEIGHT = 352.23;
const TILE_MAX_WIDTH = 414.39;
const BORDER = 2;
const SCROLL_PADDING = 64;

type PhotoCarouselProps = {
  media: TweetMedia[];
  href: string;
};

type Direction = "prev" | "next";

function tileWidth(photo: TweetMedia) {
  const inner = TILE_HEIGHT - BORDER;
  return Math.min((photo.width / photo.height) * inner + BORDER, TILE_MAX_WIDTH);
}

function offsetToTile(list: HTMLDivElement, direction: Direction) {
  const origin = list.getBoundingClientRect().left + SCROLL_PADDING;
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

export function PhotoCarousel({ media, href }: PhotoCarouselProps) {
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

    const offset = offsetToTile(list, direction);
    if (offset !== undefined) list.scrollBy({ left: offset, behavior: "smooth" });
  }

  return (
    <div className="group/carousel relative mt-3">
      <div
        ref={attachList}
        onScroll={(event) => updateArrows(event.currentTarget)}
        onClick={openTweetFromGap}
        className="relative -mr-4 -ml-16 flex scroll-pl-16 gap-1 overflow-x-auto pr-4 pl-16 [scrollbar-width:none] cursor-pointer snap-x snap-mandatory"
      >
        {media.map((photo, index) => (
          <Link
            key={photo.url}
            href={href}
            aria-label={`Image ${index + 1} of ${media.length}`}
            style={{ width: tileWidth(photo), height: TILE_HEIGHT }}
            className="relative shrink-0 snap-start overflow-hidden rounded-lg border border-border"
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              sizes="414px"
              className="object-cover"
            />
          </Link>
        ))}
      </div>

      <Arrow
        label="Previous"
        icon={BackIcon}
        visible={canPrev}
        className="left-0.5"
        onClick={() => scroll("prev")}
      />
      <Arrow
        label="Next"
        icon={ArrowRightIcon}
        visible={canNext}
        className="right-0.5"
        onClick={() => scroll("next")}
      />
    </div>
  );
}
