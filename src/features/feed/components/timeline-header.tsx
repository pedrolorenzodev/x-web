"use client";

import { PlusIcon } from "@/components/ui/icons";
import { Tab } from "@/components/ui/tab";
import { ProgressBar } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import type { TimelineKind } from "@/features/feed/types/timeline-kind";
import { useTimelineTabs } from "@/features/feed/components/timeline-tabs-provider";

const interactive =
  "transition-colors duration-200 ease-[ease] hover:bg-foreground/10";

const tabs: { kind: TimelineKind; label: string }[] = [
  { kind: "for-you", label: "For you" },
  { kind: "following", label: "Following" },
];

type TimelineHeaderProps = {
  kind: TimelineKind | null;
};

export function TimelineHeader({ kind }: TimelineHeaderProps) {
  const { pending, select } = useTimelineTabs();
  const activeKind = pending?.kind ?? kind;

  return (
    <div className="sticky top-0 z-3">
      <div className="relative z-0 border-b border-border bg-background/65 backdrop-blur-[12px]">
        <div className="flex">
          <div role="tablist" className="flex flex-1">
            {tabs.map((tab) => (
              <Tab
                key={tab.kind}
                label={tab.label}
                active={tab.kind === activeKind}
                onClick={() => select(tab.kind, activeKind)}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Manage timelines"
            className={cn(
              "flex size-[53px] shrink-0 items-center justify-center",
              interactive,
            )}
          >
            <PlusIcon className="size-4 text-muted" />
          </button>
        </div>
      </div>
      {pending?.reselected ? (
        <div className="absolute inset-x-0 top-full">
          <ProgressBar label="Refreshing timeline" />
        </div>
      ) : null}
    </div>
  );
}
