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

type SelectOptions = {
  smooth?: boolean;
  prepare?: () => Promise<void>;
};

type TimelineTabsValue = {
  pending: PendingSelection | null;
  generation: number;
  select: (
    kind: TimelineKind,
    activeKind: TimelineKind | null,
    options?: SelectOptions,
  ) => void;
};

const SMOOTH_SCROLL_TIMEOUT_MS = 1000;

function smoothScrollToTop() {
  return new Promise<void>((resolve) => {
    if (window.scrollY <= 0) return resolve();

    const timer = window.setTimeout(finish, SMOOTH_SCROLL_TIMEOUT_MS);
    function onScroll() {
      if (window.scrollY <= 0) finish();
    }
    function finish() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      resolve();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const TimelineTabsContext = createContext<TimelineTabsValue>({
  pending: null,
  generation: 0,
  select: () => {},
});

export function TimelineTabsProvider({ children }: { children: ReactNode }) {
  const [, startTransition] = useTransition();
  const [pending, setPending] = useOptimistic<PendingSelection | null>(null);
  const [generation, setGeneration] = useState(0);

  const select = (
    kind: TimelineKind,
    activeKind: TimelineKind | null,
    { smooth = false, prepare }: SelectOptions = {},
  ) => {
    const reselected = kind === activeKind;
    const scrolled = smooth ? smoothScrollToTop() : window.scrollTo({ top: 0 });
    if (reselected) setGeneration((current) => current + 1);

    startTransition(async () => {
      setPending({ kind, reselected });
      await Promise.all([scrolled, prepare?.()]);
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
