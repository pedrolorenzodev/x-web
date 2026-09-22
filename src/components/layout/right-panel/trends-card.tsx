import { IconButton } from "@/components/ui/icon-button";
import { MoreHorizontalIcon } from "@/components/ui/icons";
import {
  card,
  heading,
  row,
  showMore,
} from "@/components/layout/right-panel/styles";

// TODO: decorative only. There is no trends feature in scope.
const trends = [
  { category: "Technology · Trending", topic: "Next.js" },
  { category: "Trending in Argentina", topic: "Supabase" },
  { category: "Design · Trending", topic: "Design systems" },
  { category: "Trending in Argentina", topic: "TypeScript" },
];

export function TrendsCard() {
  return (
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
  );
}
