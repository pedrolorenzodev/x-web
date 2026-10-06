"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { ProgressBar } from "@/components/ui/spinner";
import { TabBar } from "@/components/ui/tab-bar";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  listTimelineKind,
  type TimelineKind,
} from "@/features/feed/types/timeline-kind";
import type { TimelineList } from "@/features/feed/types/timeline-list";
import { useTimelineTabs } from "@/features/feed/components/timeline-tabs-provider";
import { ManageTimelinesModal } from "@/features/feed/components/manage-timelines-modal";

const interactive =
  "transition-colors duration-200 ease-[ease] hover:bg-foreground/10";

const homeTabs: { kind: TimelineKind; label: string }[] = [
  { kind: "for-you", label: "For you" },
  { kind: "following", label: "Following" },
];

type TimelineHeaderBarProps = {
  kind: TimelineKind | null;
  lists: TimelineList[] | null;
};

export function TimelineHeaderBar({ kind, lists }: TimelineHeaderBarProps) {
  const { pending, select } = useTimelineTabs();
  const [managing, setManaging] = useState(false);
  const activeKind = pending?.kind ?? kind;
  const tabs = [
    ...homeTabs,
    ...(lists ?? [])
      .filter((list) => list.pinned)
      .map((list) => ({ kind: listTimelineKind(list.id), label: list.name })),
  ];

  return (
    <div className="sticky top-0 z-3">
      <div className="relative z-0 border-b border-border bg-background/65 backdrop-blur-[12px]">
        <div className="flex">
          <TabBar label="Timelines" className="min-w-0 flex-1 border-b-0">
            {tabs.map((tab) => {
              const active = tab.kind === activeKind;
              return (
                <button
                  key={tab.kind}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => select(tab.kind, activeKind)}
                  className={cn(
                    "flex h-[53px] shrink-0 grow justify-center px-4",
                    interactive,
                  )}
                >
                  <span
                    className={cn(
                      "relative flex h-full items-center text-base whitespace-nowrap",
                      active ? "font-bold" : "font-medium text-muted",
                    )}
                  >
                    {tab.label}
                    {active ? (
                      <span className="absolute bottom-0 left-1/2 h-1 w-full min-w-[56px] -translate-x-1/2 rounded-full bg-accent" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </TabBar>
          <Tooltip label="Manage timelines">
            <button
              type="button"
              aria-label="Manage timelines"
              aria-haspopup="dialog"
              disabled={lists === null}
              onClick={() => setManaging(true)}
              className={cn(
                "flex size-[53px] shrink-0 items-center justify-center",
                interactive,
              )}
            >
              <PlusIcon className="size-4 text-muted" />
            </button>
          </Tooltip>
        </div>
      </div>
      {pending?.reselected ? (
        <div className="absolute inset-x-0 top-full">
          <ProgressBar label="Refreshing timeline" />
        </div>
      ) : null}
      {managing && lists ? (
        <ManageTimelinesModal
          lists={lists}
          onClose={() => setManaging(false)}
        />
      ) : null}
    </div>
  );
}
