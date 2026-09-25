"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import { routes } from "@/config/routes";
import { PopoverArrowIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { focusWithModality } from "@/utils/focus-with-modality";

type AccountMenuProps = {
  handle: string;
  children: ReactNode;
};

type MenuState = "closed" | "open" | "closing";

type Placement = {
  left: number;
  bottom: number;
  arrowLeft: number;
};

const MENU_WIDTH = 300;
const ANCHOR_GAP = 10;
const FADE_MS = 250;

function placeAbove(anchor: DOMRect): Placement {
  const viewportWidth = window.innerWidth;
  const center = anchor.left + anchor.width / 2;
  const bottom = window.innerHeight - anchor.top + ANCHOR_GAP;

  if (center >= MENU_WIDTH / 2 && viewportWidth - center >= MENU_WIDTH / 2) {
    return { left: center - MENU_WIDTH / 2, bottom, arrowLeft: MENU_WIDTH / 2 };
  }
  if (viewportWidth - anchor.left >= MENU_WIDTH) {
    return { left: anchor.left, bottom, arrowLeft: anchor.width / 2 };
  }
  if (anchor.right >= MENU_WIDTH) {
    return {
      left: anchor.right - MENU_WIDTH,
      bottom,
      arrowLeft: MENU_WIDTH - anchor.width / 2,
    };
  }
  return { left: 0, bottom, arrowLeft: center };
}

const item =
  "flex h-11 w-full items-center px-4 text-left text-base font-bold text-foreground outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-menu-hover focus-visible:bg-menu-hover focus-visible:shadow-[inset_0_0_0_2px_var(--color-menu-focus-ring)] active:bg-menu-pressed";

function ItemLabel({ children }: { children: ReactNode }) {
  return (
    <>
      <span className="min-w-0 grow truncate">{children}</span>
      <span className="ml-5 w-5 shrink-0" />
    </>
  );
}

export function AccountMenu({ handle, children }: AccountMenuProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
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
    setPlacement(placeAbove(anchor.getBoundingClientRect()));
    setState("open");
  }

  const onEscape = useEffectEvent(() => close(true));

  useEffect(() => {
    if (!isOpen) return;
    menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onEscape();
    }

    function onScroll() {
      setState("closing");
    }

    function onResize() {
      const anchor = anchorRef.current;
      if (anchor) setPlacement(placeAbove(anchor.getBoundingClientRect()));
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

  useEffect(() => {
    if (state !== "closing") return;
    const fading = (popoverRef.current?.getAnimations().length ?? 0) > 0;
    const timeout = window.setTimeout(
      () => setState("closed"),
      fading ? FADE_MS + 50 : 0,
    );
    return () => window.clearTimeout(timeout);
  }, [state]);

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

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label="Account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
        className="mt-auto mb-3 flex w-full items-center gap-3 rounded-full p-3 transition-colors duration-200 ease-[ease] hover:bg-foreground/10 active:bg-foreground/20"
      >
        {children}
      </button>

      {state !== "closed" &&
        placement &&
        createPortal(
          <>
            {isOpen && (
              <div
                aria-hidden
                onClick={() => close(true)}
                className="fixed inset-0 z-30"
              />
            )}
            <div
              ref={popoverRef}
              inert={!isOpen}
              style={{ left: placement.left, bottom: placement.bottom }}
              onTransitionEnd={(event) => {
                if (event.target === event.currentTarget && !isOpen) {
                  setState("closed");
                }
              }}
              className={cn(
                "fixed z-30 w-[300px] transition-opacity duration-250 ease-[ease] starting:opacity-0",
                isOpen ? "opacity-100" : "opacity-0",
              )}
            >
              <div
                ref={menuRef}
                role="menu"
                aria-label="Account menu"
                onKeyDown={onMenuKeyDown}
                className="max-h-[480px] overflow-auto rounded-2xl bg-elevated py-3 shadow-menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={selectItem}
                  className={item}
                >
                  <ItemLabel>Add an existing account</ItemLabel>
                </button>
                <Link
                  href={routes.logout}
                  role="menuitem"
                  onClick={selectItem}
                  className={item}
                >
                  <ItemLabel>Log out @{handle}</ItemLabel>
                </Link>
              </div>
              <PopoverArrowIcon
                style={{ left: placement.arrowLeft - 12 }}
                className="absolute -bottom-[11px] h-[16.25px] w-6 rotate-180 text-elevated"
              />
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
