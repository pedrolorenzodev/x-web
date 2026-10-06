import type { TimelineKind } from "@/features/feed/types/timeline-kind";
import { getTimelineLists } from "@/features/feed/api/get-timeline-lists";
import { TimelineHeaderBar } from "@/features/feed/components/timeline-header-bar";

type TimelineHeaderProps = {
  kind: TimelineKind | null;
};

async function TimelineHeaderWithLists({ kind }: { kind: TimelineKind }) {
  const lists = await getTimelineLists();
  return <TimelineHeaderBar kind={kind} lists={lists} />;
}

export function TimelineHeader({ kind }: TimelineHeaderProps) {
  if (kind === null) return <TimelineHeaderBar kind={null} lists={null} />;
  return <TimelineHeaderWithLists kind={kind} />;
}
