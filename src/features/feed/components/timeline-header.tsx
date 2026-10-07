import type { UserSummary } from "@/types/user";
import type { TimelineKind } from "@/features/feed/types/timeline-kind";
import { getTimelineLists } from "@/features/feed/api/get-timeline-lists";
import { TimelineHeaderBar } from "@/features/feed/components/timeline-header-bar";

type TimelineHeaderProps = {
  kind: TimelineKind | null;
  viewer: UserSummary | null;
};

async function TimelineHeaderWithLists({
  kind,
  viewer,
}: {
  kind: TimelineKind;
  viewer: UserSummary | null;
}) {
  const lists = await getTimelineLists();
  return <TimelineHeaderBar kind={kind} lists={lists} viewer={viewer} />;
}

export function TimelineHeader({ kind, viewer }: TimelineHeaderProps) {
  if (kind === null) {
    return <TimelineHeaderBar kind={null} lists={null} viewer={viewer} />;
  }
  return <TimelineHeaderWithLists kind={kind} viewer={viewer} />;
}
