import Link from "next/link";
import type { NewsStory } from "@/types/news";
import { Facepile } from "@/components/ui/facepile";
import { cn } from "@/lib/utils";
import { formatCount } from "@/utils/format-count";
import { formatNewsTime } from "@/utils/format-news-time";

type NewsRowProps = {
  story: NewsStory;
  variant?: "panel" | "column";
  className?: string;
};

export function newsStoryHref(id: string) {
  return `/i/trending/${id}`;
}

export function NewsRow({ story, variant = "column", className }: NewsRowProps) {
  const panel = variant === "panel";
  const posts = panel
    ? story.postCount.toLocaleString("en-US")
    : formatCount(story.postCount);

  return (
    <Link
      href={newsStoryHref(story.id)}
      className={cn(
        "flex flex-col px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3",
        className,
      )}
    >
      <span
        className={cn(
          "font-bold",
          panel ? "line-clamp-2 text-base" : "text-lg",
        )}
      >
        {story.headline}
      </span>
      <span className="mt-1.5 flex items-center gap-2">
        <Facepile users={story.facepile.slice(0, 3)} overlap={panel ? 10 : 12} />
        <span className="truncate text-xs text-muted">
          {formatNewsTime(story.publishedAt, story.isTrendingNow)} ·{" "}
          {story.category} · {posts} posts
        </span>
      </span>
    </Link>
  );
}
