import { cookies } from "next/headers";
import { getMockViewer } from "@/mocks/session";
import {
  DEFAULT_TIMELINE_KIND,
  TIMELINE_KIND_COOKIE,
  isListTimelineKind,
  listIdOf,
  toTimelineKind,
  type TimelineKind,
} from "@/features/feed/types/timeline-kind";
import { findPinnedList } from "@/features/feed/api/find-pinned-list";

export async function getTimelineKind(): Promise<TimelineKind> {
  const kind = toTimelineKind((await cookies()).get(TIMELINE_KIND_COOKIE)?.value);
  if (!isListTimelineKind(kind)) return kind;

  const viewer = await getMockViewer();
  return findPinnedList(listIdOf(kind), viewer?.id ?? null)
    ? kind
    : DEFAULT_TIMELINE_KIND;
}
