"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import {
  placeBelowCentered,
  type FloatingPosition,
} from "@/utils/floating-position";

const OPEN_DELAY = 600;
const GAP = 2;

type TooltipProps = {
  label: string;
  disabled?: boolean;
  children: ReactNode;
};

export function Tooltip({ label, disabled = false, children }: TooltipProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  function show(event: PointerEvent) {
    if (disabled || event.pointerType === "touch") return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const target = wrapperRef.current?.firstElementChild;
      if (target) setAnchor(target.getBoundingClientRect());
    }, OPEN_DELAY);
  }

  function hide() {
    window.clearTimeout(timer.current);
    setAnchor(null);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!anchor) return;
    function onScroll() {
      setAnchor(null);
    }
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [anchor]);

  return (
    <span
      ref={wrapperRef}
      className="contents"
      onPointerEnter={show}
      onPointerLeave={hide}
      onPointerDown={hide}
    >
      {children}
      {anchor ? <TooltipBubble anchor={anchor} label={label} /> : null}
    </span>
  );
}

function TooltipBubble({ anchor, label }: { anchor: DOMRect; label: string }) {
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  useLayoutEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    setPosition(
      placeBelowCentered(
        anchor,
        { width: bubble.offsetWidth, height: bubble.offsetHeight },
        GAP,
      ),
    );
  }, [anchor]);

  return createPortal(
    <span
      ref={bubbleRef}
      role="tooltip"
      style={
        position
          ? { top: position.top, left: position.left }
          : { top: 0, left: 0, visibility: "hidden" }
      }
      className={cn(
        "t-tooltip pointer-events-none fixed z-70 rounded-full bg-tooltip px-2 py-1 text-[11px] leading-3 font-normal tracking-normal whitespace-nowrap text-white",
        position?.side === "top" ? "origin-bottom" : "origin-top",
      )}
    >
      {label}
    </span>,
    document.body,
  );
}
