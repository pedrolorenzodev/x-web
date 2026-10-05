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
import {
  placeBelowCentered,
  type FloatingPosition,
} from "@/utils/floating-position";

const OPEN_DELAY = 600;
const CLOSE_DELAY = 600;
const GAP = 10;

type HoverCardProps = {
  label: string;
  content: ReactNode;
  disabled?: boolean;
  children: ReactNode;
};

export function HoverCard({
  label,
  content,
  disabled = false,
  children,
}: HoverCardProps) {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const openTimer = useRef<number | undefined>(undefined);
  const closeTimer = useRef<number | undefined>(undefined);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  function clearTimers() {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  }

  function scheduleOpen(event: PointerEvent) {
    if (disabled || event.pointerType === "touch") return;
    clearTimers();
    if (anchor) return;
    openTimer.current = window.setTimeout(() => {
      const target = wrapperRef.current?.firstElementChild;
      if (target) setAnchor(target.getBoundingClientRect());
    }, OPEN_DELAY);
  }

  function scheduleClose() {
    clearTimers();
    closeTimer.current = window.setTimeout(() => setAnchor(null), CLOSE_DELAY);
  }

  function closeNow() {
    clearTimers();
    setAnchor(null);
  }

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!anchor) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setAnchor(null);
    }
    function onScroll() {
      setAnchor(null);
    }
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [anchor]);

  return (
    <span
      ref={wrapperRef}
      className="contents"
      onPointerEnter={scheduleOpen}
      onPointerLeave={scheduleClose}
      onPointerDown={closeNow}
    >
      {children}
      {anchor ? (
        <HoverCardPanel
          anchor={anchor}
          label={label}
          onPointerEnter={clearTimers}
          onPointerLeave={scheduleClose}
        >
          {content}
        </HoverCardPanel>
      ) : null}
    </span>
  );
}

type HoverCardPanelProps = {
  anchor: DOMRect;
  label: string;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
  children: ReactNode;
};

function HoverCardPanel({
  anchor,
  label,
  onPointerEnter,
  onPointerLeave,
  children,
}: HoverCardPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    function place() {
      if (!panel) return;
      setPosition(
        placeBelowCentered(
          anchor,
          { width: panel.offsetWidth, height: panel.offsetHeight },
          GAP,
        ),
      );
    }
    place();
    const observer = new ResizeObserver(place);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [anchor]);

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-label={label}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onClick={(event) => event.stopPropagation()}
      style={
        position
          ? { top: position.top, left: position.left }
          : { top: 0, left: 0, visibility: "hidden" }
      }
      className="t-hover-card fixed z-70 w-[300px] rounded-2xl bg-elevated p-4 text-left shadow-menu"
    >
      {children}
    </div>,
    document.body,
  );
}
