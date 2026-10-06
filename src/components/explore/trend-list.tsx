"use client";

import { useState } from "react";
import type { Trend } from "@/types/trend";
import { TrendRow } from "@/components/explore/trend-row";
import { showToast } from "@/components/ui/toast";

type TrendListProps = {
  trends: Trend[];
  limit?: number;
  ranked?: boolean;
};

export function TrendList({ trends, limit, ranked = false }: TrendListProps) {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const visible = trends
    .filter((trend) => !dismissed.includes(trend.id))
    .slice(0, limit);

  function dismiss(trendId: string) {
    setDismissed((current) => [...current, trendId]);
    showToast({ message: "Thanks. Refresh this page to update these trends." });
  }

  return visible.map((trend, index) => (
    <TrendRow
      key={trend.id}
      trend={trend}
      rank={ranked ? index + 1 : undefined}
      onDismiss={dismiss}
    />
  ));
}
