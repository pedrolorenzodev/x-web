export const timelineKinds = ["for-you", "following"] as const;

export type HomeTimelineKind = (typeof timelineKinds)[number];

export type ListTimelineKind = `list:${string}`;

export type TimelineKind = HomeTimelineKind | ListTimelineKind;

export const DEFAULT_TIMELINE_KIND: TimelineKind = "for-you";

export const TIMELINE_KIND_COOKIE = "timeline_tab";

const LIST_KIND_PATTERN = /^list:\d{1,20}$/;

export function listTimelineKind(listId: string): ListTimelineKind {
  return `list:${listId}`;
}

export function isListTimelineKind(kind: TimelineKind): kind is ListTimelineKind {
  return kind.startsWith("list:");
}

export function listIdOf(kind: ListTimelineKind) {
  return kind.slice("list:".length);
}

export function toTimelineKind(value: unknown): TimelineKind {
  if (typeof value === "string" && LIST_KIND_PATTERN.test(value)) {
    return value as ListTimelineKind;
  }
  return timelineKinds.find((kind) => kind === value) ?? DEFAULT_TIMELINE_KIND;
}
