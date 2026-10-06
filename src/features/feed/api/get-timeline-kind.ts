import { cookies } from "next/headers";
import {
  TIMELINE_KIND_COOKIE,
  toTimelineKind,
  type TimelineKind,
} from "@/features/feed/types/timeline-kind";

export async function getTimelineKind(): Promise<TimelineKind> {
  return toTimelineKind((await cookies()).get(TIMELINE_KIND_COOKIE)?.value);
}
