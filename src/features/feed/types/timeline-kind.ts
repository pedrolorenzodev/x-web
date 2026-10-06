export const timelineKinds = ["for-you", "following"] as const;

export type TimelineKind = (typeof timelineKinds)[number];

export const DEFAULT_TIMELINE_KIND: TimelineKind = "for-you";

export const TIMELINE_KIND_COOKIE = "timeline_tab";

export function toTimelineKind(value: unknown): TimelineKind {
  return timelineKinds.find((kind) => kind === value) ?? DEFAULT_TIMELINE_KIND;
}
