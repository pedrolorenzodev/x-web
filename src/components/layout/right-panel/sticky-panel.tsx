"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type Edge = "top" | "bottom";

export function StickyPanel({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState<Edge>("top");
  const [offset, setOffset] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const panel = panelRef.current;
    const column = panel?.parentElement;
    if (!panel || !column) return;

    const observer = new ResizeObserver(([entry]) => {
      setHeight(entry.borderBoxSize[0].blockSize);
    });
    observer.observe(panel);

    let lastY = window.scrollY;
    let current: Edge = "top";

    function onScroll() {
      if (!panel || !column) return;
      const y = window.scrollY;
      if (y === lastY) return;

      const next: Edge = y > lastY ? "top" : "bottom";
      lastY = y;

      if (panel.offsetHeight <= window.innerHeight || y <= 0) {
        current = "top";
        setEdge("top");
        setOffset(0);
        return;
      }
      if (next === current) return;

      current = next;
      setOffset(
        panel.getBoundingClientRect().top - column.getBoundingClientRect().top,
      );
      setEdge(next);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <div aria-hidden style={{ height: offset }} />
      <div
        ref={panelRef}
        style={{ [edge]: `min(0px, calc(100dvh - ${height}px))` }}
        className="sticky"
      >
        {children}
      </div>
    </>
  );
}
