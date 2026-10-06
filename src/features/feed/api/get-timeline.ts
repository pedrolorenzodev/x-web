"use server";

import { connection } from "next/server";
import type { Page } from "@/types/pagination";
import type { TimelineItem } from "@/types/tweet";
import { getMockViewer } from "@/mocks/session";
import { paginate } from "@/utils/paginate";
import { toTimelineKind } from "@/features/feed/types/timeline-kind";
import { buildTimelineItems } from "@/features/feed/api/timeline-items";

const PAGE_SIZE = 10;

export async function getTimeline(
  kind: string,
  cursor: string | null = null,
  limit = PAGE_SIZE,
): Promise<Page<TimelineItem>> {
  await connection();
  const viewer = await getMockViewer();
  const items = buildTimelineItems(toTimelineKind(kind), viewer?.id ?? null);

  return paginate(items, cursor, limit, (item) => item.tweet.id);
}
