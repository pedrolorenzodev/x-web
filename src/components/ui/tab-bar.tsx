"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BackIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

type TabBarProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

const arrow =
  "absolute top-1/2 z-1 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-[rgb(15_20_25/0.75)] text-white backdrop-blur-[4px] transition-opacity duration-200 ease-[ease] disabled:pointer-events-none disabled:opacity-0";

export function TabBar({ label, className, children }: TabBarProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
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
  }, []);

  function scrollBy(direction: 1 | -1) {
    const list = listRef.current;
    list?.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: "smooth" });
  }

  return (
    <div className={cn("group/tabs relative border-b border-border", className)}>
      <button
        type="button"
        aria-label="Previous"
        disabled={edges.start}
        onClick={() => scrollBy(-1)}
        className={cn(arrow, "left-1 opacity-0 group-hover/tabs:opacity-100")}
      >
        <BackIcon className="size-5" />
      </button>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className="flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <button
        type="button"
        aria-label="Next"
        disabled={edges.end}
        onClick={() => scrollBy(1)}
        className={cn(arrow, "right-1 opacity-0 group-hover/tabs:opacity-100")}
      >
        <BackIcon className="size-5 rotate-180" />
      </button>
    </div>
  );
}
