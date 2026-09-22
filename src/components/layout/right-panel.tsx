import Image from "next/image";
import Link from "next/link";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import {
  CloseIcon,
  ExploreIcon,
  MoreHorizontalIcon,
} from "@/components/ui/icons";

type RightPanelProps = {
  suggestions: UserSummary[];
};

const card = "rounded-2xl border border-border";
const heading = "px-4 pt-3 pb-2 text-xl font-extrabold";
const row =
  "cursor-pointer transition-colors duration-200 ease-[ease] hover:bg-white/3";
const showMore =
  "flex h-13 w-full items-center rounded-b-2xl px-4 text-base text-accent";

// TODO: decorative only. There is no news feature in scope.
const news = [
  {
    headline: "Next.js 16 ships Cache Components as stable",
    meta: "2 hours ago · Technology · 4,812 posts",
    sources: ["/avatars/ana.svg", "/avatars/lucas.svg", "/avatars/nico.svg"],
  },
  {
    headline: "Supabase announces branching for every project",
    meta: "5 hours ago · Technology · 1,204 posts",
    sources: ["/avatars/martin.svg", "/avatars/valen.svg", "/avatars/pedro.svg"],
  },
  {
    headline: "Type-safe routing lands in the App Router",
    meta: "9 hours ago · Technology · 938 posts",
    sources: ["/avatars/sofia.svg", "/avatars/nico.svg", "/avatars/ana.svg"],
  },
];

// TODO: decorative only. There is no trends feature in scope.
const trends = [
  { category: "Technology · Trending", topic: "Next.js" },
  { category: "Trending in Argentina", topic: "Supabase" },
  { category: "Design · Trending", topic: "Design systems" },
  { category: "Trending in Argentina", topic: "TypeScript" },
];

export function RightPanel({ suggestions }: RightPanelProps) {
  return (
    <aside className="w-panel shrink-0">
      <div className="sticky top-0 flex flex-col gap-4 pt-1.5">
        <div
          role="search"
          className="flex h-11 items-center rounded-full border border-border-strong"
        >
          <span className="flex w-[29px] shrink-0 pl-[13px]">
            <ExploreIcon className="size-4 text-muted" />
          </span>
          <input
            type="search"
            placeholder="Search"
            className="h-10 w-full bg-transparent pr-4 pl-1 text-sm outline-none placeholder:text-muted"
          />
        </div>

        <section className={card}>
          <div className="flex flex-col items-start gap-[10px] px-5 py-4">
            <h2 className="text-xl font-bold">Subscribe to Premium</h2>
            <p className="text-base">
              Get rid of ads, see your analytics, boost your replies and unlock
              20+ features.
            </p>
            <Button variant="accent" className="mt-2">
              Subscribe
            </Button>
          </div>
        </section>

        <section className={card}>
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-xl font-extrabold">Today&apos;s News</h2>
            <IconButton label="Close" tone="plain" className="size-8">
              <CloseIcon className="size-[18px]" />
            </IconButton>
          </div>
          {news.map((item) => (
            <div key={item.headline} className={`flex flex-col px-4 py-[17px] ${row}`}>
              <span className="line-clamp-2 text-base font-bold">
                {item.headline}
              </span>
              <span className="mt-2 flex items-center gap-[9px]">
                <span className="flex">
                  {item.sources.map((src, index) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={22}
                      height={22}
                      style={{ zIndex: item.sources.length - index }}
                      className={cn(
                        "relative rounded-full ring-[3px] ring-background",
                        index > 0 && "-ml-[10px]",
                      )}
                    />
                  ))}
                </span>
                <span className="text-xs text-muted">{item.meta}</span>
              </span>
            </div>
          ))}
        </section>

        <section className={card}>
          <h2 className={heading}>What&apos;s happening</h2>
          {trends.map((trend) => (
            <div key={trend.topic} className={`flex items-start px-4 py-3 ${row}`}>
              <span className="flex min-w-0 flex-col">
                <span className="text-xs text-muted">{trend.category}</span>
                <span className="text-base font-bold">{trend.topic}</span>
              </span>
              <IconButton label="More" className="-mr-2 ml-auto">
                <MoreHorizontalIcon className="size-[18.75px]" />
              </IconButton>
            </div>
          ))}
          <button type="button" className={`${showMore} ${row}`}>
            Show more
          </button>
        </section>

        <section className={card}>
          <h2 className={heading}>Who to follow</h2>
          {suggestions.map((user) => (
            <div
              key={user.id}
              className={`relative flex items-center gap-3 px-4 py-3 ${row}`}
            >
              <Link
                href={routes.profile(user.handle)}
                aria-label={user.displayName}
                className="absolute inset-0"
              />
              <Avatar src={user.avatarUrl} alt={user.displayName} />
              <span className="flex min-w-0 flex-col">
                <span className="truncate text-base font-bold">
                  {user.displayName}
                </span>
                <span className="truncate text-base text-muted">
                  @{user.handle}
                </span>
              </span>
              <Button size="sm" className="relative ml-auto shrink-0">
                Follow
              </Button>
            </div>
          ))}
          <button type="button" className={`${showMore} ${row}`}>
            Show more
          </button>
        </section>
      </div>
    </aside>
  );
}
