"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, RefObject } from "react";
import { focusWithModality } from "@/utils/focus-with-modality";

export type MenuState = "closed" | "open" | "closing";

export type DropdownMenuController<Placement> = {
  state: MenuState;
  isOpen: boolean;
  placement: Placement | null;
  toggle: (event: MouseEvent<HTMLButtonElement>) => void;
  close: (restoreFocus: boolean) => void;
  finishClosing: () => void;
  selectItem: (event: MouseEvent<HTMLElement>) => void;
  onMenuKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
};

export function useDropdownMenu<Placement>(
  anchorRef: RefObject<HTMLElement | null>,
  place: (anchor: DOMRect) => Placement,
): DropdownMenuController<Placement> {
  const [state, setState] = useState<MenuState>("closed");
  const [placement, setPlacement] = useState<Placement | null>(null);
  const usingKeyboard = useRef(false);
  const isOpen = state === "open";

  function focusAnchor() {
    const anchor = anchorRef.current;
    if (anchor) focusWithModality(anchor, usingKeyboard.current);
  }

  function close(restoreFocus: boolean) {
    setState((current) => (current === "closed" ? current : "closing"));
    if (restoreFocus) focusAnchor();
  }

  function finishClosing() {
    setState((current) => (current === "closing" ? "closed" : current));
  }

  function selectItem(event: MouseEvent<HTMLElement>) {
    if (event.detail === 0) usingKeyboard.current = true;
    close(true);
  }

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    if (isOpen) {
      close(false);
      return;
    }
    const anchor = anchorRef.current;
    if (!anchor) return;
    usingKeyboard.current = event.detail === 0;
    setPlacement(place(anchor.getBoundingClientRect()));
    setState("open");
  }

  const onEscape = useEffectEvent(() => close(true));
  const onResize = useEffectEvent(() => {
    const anchor = anchorRef.current;
    if (anchor) setPlacement(place(anchor.getBoundingClientRect()));
  });

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onEscape();
    }

    function onScroll() {
      setState("closing");
    }

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isOpen]);

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    usingKeyboard.current = true;
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("[role=menuitem]"),
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    const step = event.shiftKey ? -1 : 1;
    event.preventDefault();
    items[(index + step + items.length) % items.length]?.focus();
  }

  return {
    state,
    isOpen,
    placement,
    toggle,
    close,
    finishClosing,
    selectItem,
    onMenuKeyDown,
  };
}
