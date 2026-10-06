import Link from "next/link";
import type { Trend } from "@/types/trend";
import { TrendList } from "@/components/explore/trend-list";
import {
  card,
  heading,
  row,
  showMore,
} from "@/components/layout/right-panel/styles";

const VISIBLE = 4;

export function TrendsCard({ trends }: { trends: Trend[] }) {
  return (
    <section className={card}>
      <h2 className={heading}>What&apos;s happening</h2>
      <TrendList trends={trends} limit={VISIBLE} />
      <Link href="/explore/tabs/for-you" className={`${showMore} ${row}`}>
        Show more
      </Link>
    </section>
  );
}
