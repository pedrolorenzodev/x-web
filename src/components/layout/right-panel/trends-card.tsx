"use client";

import Link from "next/link";
import { useState } from "react";
import type { Trend } from "@/types/trend";
import { TrendRow } from "@/components/explore/trend-row";
import { showToast } from "@/components/ui/toast";
import {
  card,
  heading,
  row,
  showMore,
} from "@/components/layout/right-panel/styles";

const VISIBLE = 4;

export function TrendsCard({ trends }: { trends: Trend[] }) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = trends
    .filter((trend) => !dismissed.includes(trend.id))
    .slice(0, VISIBLE);

  function dismiss(trendId: string) {
    setDismissed((current) => [...current, trendId]);
    showToast({ message: "Thanks. Refresh this page to update these trends." });
  }

  return (
    <section className={card}>
      <h2 className={heading}>What&apos;s happening</h2>
      {visible.map((trend) => (
        <TrendRow key={trend.id} trend={trend} onDismiss={dismiss} />
      ))}
      <Link href="/explore/tabs/for-you" className={`${showMore} ${row}`}>
        Show more
      </Link>
    </section>
  );
}
