"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import type { DropdownMenuController } from "@/hooks/use-dropdown-menu";

type DropdownMenuProps<Placement> = {
  menu: DropdownMenuController<Placement>;
  label: string;
  style: CSSProperties;
  className?: string;
  decoration?: ReactNode;
  children: ReactNode;
};

const FADE_MS = 250;

export const menuItem =
  "flex h-11 w-full items-center px-4 text-left text-base font-bold text-foreground outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-menu-hover focus-visible:bg-menu-hover focus-visible:shadow-[inset_0_0_0_2px_var(--color-menu-focus-ring)] active:bg-menu-pressed";

export function DropdownMenu<Placement>({
  menu,
  label,
  style,
  className,
  decoration,
  children,
}: DropdownMenuProps<Placement>) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { state, isOpen, close, finishClosing, onMenuKeyDown } = menu;
  const onFadedOut = useEffectEvent(finishClosing);

  useEffect(() => {
    if (isOpen) {
      menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (state !== "closing") return;
    const fading = (popoverRef.current?.getAnimations().length ?? 0) > 0;
    const timeout = window.setTimeout(onFadedOut, fading ? FADE_MS + 50 : 0);
    return () => window.clearTimeout(timeout);
  }, [state]);

  if (state === "closed") return null;

  return createPortal(
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
        style={style}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget) finishClosing();
        }}
        className={cn(
          "fixed z-30 transition-opacity duration-250 ease-[ease] starting:opacity-0",
          isOpen ? "opacity-100" : "opacity-0",
          className,
        )}
      >
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className="max-h-[480px] overflow-auto rounded-2xl bg-elevated py-3 shadow-menu"
        >
          {children}
        </div>
        {decoration}
      </div>
    </>,
    document.body,
  );
}
