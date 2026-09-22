import Image from "next/image";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { CloseIcon } from "@/components/ui/icons";
import { card, row } from "@/components/layout/right-panel/styles";

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

export function NewsCard() {
  return (
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
  );
}
