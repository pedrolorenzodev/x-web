"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { CommunityTopic } from "@/types/community";
import { ArrowUpIcon, BackIcon } from "@/components/ui/icons";
import {
  communityTopics,
  topicSubcategories,
} from "@/features/communities/config/topics";
import { cn } from "@/lib/utils";

export type TopicSelection = {
  topic: CommunityTopic | null;
  subcategory: string | null;
};

const arrow =
  "absolute top-1/2 z-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[rgb(15_20_25/0.75)] text-white backdrop-blur-[4px] transition-opacity duration-200 ease-[ease] disabled:pointer-events-none disabled:opacity-0";

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex h-8 shrink-0 items-center rounded-full border px-4 text-base font-bold whitespace-nowrap transition-colors duration-200 ease-[ease]",
        selected
          ? "border-transparent bg-[rgb(26_140_216)] text-white"
          : "border-outline hover:bg-foreground/10",
      )}
    >
      {children}
    </button>
  );
}

type TopicChipsProps = {
  selection: TopicSelection;
  onChange: (selection: TopicSelection) => void;
  className?: string;
};

export function TopicChips({ selection, onChange, className }: TopicChipsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const { topic, subcategory } = selection;
  const subcategories = topic ? (topicSubcategories[topic] ?? []) : [];

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollLeft = 0;
    function update() {
      if (!list) return;
      setEdges({
        start: list.scrollLeft <= 1,
        end: list.scrollLeft + list.clientWidth >= list.scrollWidth - 1,
      });
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    list.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      list.removeEventListener("scroll", update);
    };
  }, [topic]);

  function scrollBy(direction: 1 | -1) {
    const list = listRef.current;
    list?.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className={cn("group/chips relative", className)}>
      <button
        type="button"
        aria-label="Previous"
        disabled={edges.start}
        onClick={() => scrollBy(-1)}
        className={cn(arrow, "left-1 opacity-0 group-hover/chips:opacity-100")}
      >
        <BackIcon className="size-5" />
      </button>
      <div
        ref={listRef}
        className="flex items-center gap-1.5 overflow-x-auto px-[11px] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {topic ? (
          <>
            <button
              type="button"
              aria-label="Back to all categories"
              onClick={() => onChange({ topic: null, subcategory: null })}
              className="flex size-8 shrink-0 items-center justify-center rounded-full border border-outline transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
            >
              <ArrowUpIcon className="size-[18px]" />
            </button>
            <Chip
              selected={subcategory === null}
              onClick={() => onChange({ topic, subcategory: null })}
            >
              {topic}
            </Chip>
            {subcategories.map((item) => (
              <Chip
                key={item}
                selected={subcategory === item}
                onClick={() =>
                  onChange({
                    topic,
                    subcategory: subcategory === item ? null : item,
                  })
                }
              >
                {item}
              </Chip>
            ))}
          </>
        ) : (
          communityTopics.map((item) => (
            <Chip
              key={item}
              selected={false}
              onClick={() => onChange({ topic: item, subcategory: null })}
            >
              {item}
            </Chip>
          ))
        )}
      </div>
      <button
        type="button"
        aria-label="Next"
        disabled={edges.end}
        onClick={() => scrollBy(1)}
        className={cn(arrow, "right-1 opacity-0 group-hover/chips:opacity-100")}
      >
        <BackIcon className="size-5 rotate-180" />
      </button>
    </div>
  );
}

export function matchesSelection(
  { topic, subcategory }: TopicSelection,
  item: { topic: CommunityTopic; category: string },
) {
  if (topic && item.topic !== topic) return false;
  if (subcategory && item.category !== subcategory) return false;
  return true;
}
