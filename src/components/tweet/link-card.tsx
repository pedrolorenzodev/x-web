import Image from "next/image";
import type { LinkCard as LinkCardData } from "@/types/tweet";
import { MediaBadge } from "@/components/tweet/media-badge";
import { cn } from "@/lib/utils";

const LARGE_IMAGE_RATIO = 1.91;
const frame =
  "relative mt-3 flex overflow-hidden rounded-2xl border border-border transition-colors duration-200 ease-[ease] hover:bg-white/3";

function LargeCard({ card }: { card: LinkCardData }) {
  return (
    <div className="pointer-events-none relative mt-3">
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${card.domain} ${card.title}`}
        className="pointer-events-auto relative block overflow-hidden rounded-2xl border border-border"
      >
        <div
          style={{ aspectRatio: LARGE_IMAGE_RATIO }}
          className="relative w-full"
        >
          <Image
            src={card.imageUrl}
            alt=""
            fill
            sizes="516px"
            className="object-cover"
          />
        </div>
        <MediaBadge className="absolute bottom-3 left-3 max-w-[calc(100%-24px)]">
          <span className="truncate">{card.title}</span>
        </MediaBadge>
      </a>
      <a
        href={card.url}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={-1}
        className="pointer-events-auto relative mt-1 inline-block text-xs text-muted hover:underline"
      >
        From {card.domain}
      </a>
    </div>
  );
}

function SmallCard({ card }: { card: LinkCardData }) {
  return (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(frame, "h-[131px]")}
    >
      <div className="relative aspect-square h-full shrink-0 border-r border-border">
        <Image
          src={card.imageUrl}
          alt=""
          fill
          sizes="129px"
          className="object-cover"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5 p-3 text-base">
        <span className="truncate text-muted">{card.domain}</span>
        <span className="truncate">{card.title}</span>
        {card.description ? (
          <span className="line-clamp-2 text-muted">{card.description}</span>
        ) : null}
      </div>
    </a>
  );
}

export function LinkCard({ card }: { card: LinkCardData }) {
  return card.kind === "summary_large_image" ? (
    <LargeCard card={card} />
  ) : (
    <SmallCard card={card} />
  );
}
