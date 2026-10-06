"use client";

import {
  createContext,
  use,
  useOptimistic,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import type { TimelineKind } from "@/features/feed/types/timeline-kind";
import { selectTimelineKind } from "@/features/feed/api/select-timeline-kind";

type PendingSelection = {
  kind: TimelineKind;
  reselected: boolean;
};

type TimelineTabsValue = {
  pending: PendingSelection | null;
  generation: number;
  select: (kind: TimelineKind, activeKind: TimelineKind | null) => void;
};

const TimelineTabsContext = createContext<TimelineTabsValue>({
  pending: null,
  generation: 0,
  select: () => {},
});

export function TimelineTabsProvider({ children }: { children: ReactNode }) {
  const [, startTransition] = useTransition();
  const [pending, setPending] = useOptimistic<PendingSelection | null>(null);
  const [generation, setGeneration] = useState(0);

  const select = (kind: TimelineKind, activeKind: TimelineKind | null) => {
    const reselected = kind === activeKind;
    window.scrollTo({ top: 0 });
    if (reselected) setGeneration((current) => current + 1);

    startTransition(async () => {
      setPending({ kind, reselected });
      await selectTimelineKind(kind);
    });
  };

  return (
    <TimelineTabsContext value={{ pending, generation, select }}>
      {children}
    </TimelineTabsContext>
  );
}

export function useTimelineTabs() {
  return use(TimelineTabsContext);
}
