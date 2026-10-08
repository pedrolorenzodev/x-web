"use client";

import {
  useEffect,
  useEffectEvent,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useUserCardServices } from "@/components/user/user-card-context";
import { useEscapeToClose } from "@/hooks/use-escape-to-close";
import { cn } from "@/lib/utils";
import {
  placeBelowCentered,
  type FloatingPosition,
} from "@/utils/floating-position";

const GAP = 10;
const ARROW_WIDTH = 13.6;

type AltBadgeProps = {
  description: string;
  authorId: string;
  always: boolean;
};

type PopoverProps = {
  anchor: DOMRect;
  triggerRef: RefObject<HTMLElement | null>;
  description: string;
  onDismiss: () => void;
  onOutsidePress: () => void;
};

function ImageDescriptionPopover({
  anchor,
  triggerRef,
  description,
  onDismiss,
  onOutsidePress,
}: PopoverProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const textId = useId();
  const [position, setPosition] = useState<FloatingPosition | null>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    setPosition(
      placeBelowCentered(
        anchor,
        { width: panel.offsetWidth, height: panel.offsetHeight },
        GAP,
      ),
    );
  }, [anchor]);

  const placed = position !== null;

  useEffect(() => {
    if (placed) panelRef.current?.focus({ preventScroll: true });
  }, [placed]);

  const pressOutside = useEffectEvent(onOutsidePress);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return;
      }
      pressOutside();
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [triggerRef]);

  const arrowLeft = position
    ? anchor.left + anchor.width / 2 - position.left - ARROW_WIDTH / 2
    : 0;

  return createPortal(
    <div
      ref={panelRef}
      role="dialog"
      aria-labelledby={`${headingId} ${textId}`}
      tabIndex={-1}
      onClick={(event) => event.stopPropagation()}
      style={
        position
          ? { top: position.top, left: position.left }
          : { top: 0, left: 0, visibility: "hidden" }
      }
      className="fixed z-70 w-[360px] max-w-[calc(100vw-16px)] rounded-2xl bg-background p-8 shadow-popover outline-none"
    >
      <h2 id={headingId} className="text-[26px] leading-8 font-bold">
        Image description
      </h2>
      <p id={textId} className="pt-2 pb-5 text-base break-words text-muted">
        {description}
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="flex w-full items-center justify-center rounded-full border border-outline px-8 py-4 text-lg font-bold outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-foreground/10 focus-visible:bg-foreground/10 focus-visible:shadow-[0_0_0_2px_var(--color-button-focus-ring)]"
      >
        Dismiss
      </button>
      {position ? (
        <svg
          viewBox="2 6 20 11"
          aria-hidden
          style={{ left: arrowLeft, width: ARROW_WIDTH }}
          className={cn(
            "absolute h-[7.5px] fill-background",
            position.side === "top" ? "top-full -mt-px rotate-180" : "bottom-full -mb-px",
          )}
        >
          <path d="M22 17H2L12 6l10 11z" />
        </svg>
      ) : null}
    </div>,
    document.body,
  );
}

export function AltBadge({ description, authorId, always }: AltBadgeProps) {
  const users = useUserCardServices();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const describedById = useId();
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  function dismiss() {
    setAnchor(null);
    buttonRef.current?.focus({ preventScroll: true });
  }

  useEscapeToClose(anchor !== null, dismiss);

  if (!description || !(always || users?.viewerId === authorId)) return null;

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setAnchor((current) => (current ? null : rect));
  }

  return (
    <>
      <span id={describedById} hidden>
        read image description
      </span>
      <button
        ref={buttonRef}
        type="button"
        aria-describedby={describedById}
        aria-expanded={anchor !== null}
        aria-haspopup="dialog"
        onClick={toggle}
        className="absolute bottom-3 left-3 flex h-5 items-center rounded-[4px] bg-black/30 px-2 text-xs font-bold text-white outline-none focus-visible:shadow-[0_0_0_2px_var(--color-menu-focus-ring)]"
      >
        ALT
      </button>
      {anchor ? (
        <ImageDescriptionPopover
          anchor={anchor}
          triggerRef={buttonRef}
          description={description}
          onDismiss={dismiss}
          onOutsidePress={() => setAnchor(null)}
        />
      ) : null}
    </>
  );
}
