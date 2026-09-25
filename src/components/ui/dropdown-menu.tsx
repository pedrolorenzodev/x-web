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
import { readCssMilliseconds } from "@/utils/css-custom-property";

export type DropdownOrigin =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

type DropdownMenuProps<Placement> = {
  menu: DropdownMenuController<Placement>;
  label: string;
  style: CSSProperties;
  origin: DropdownOrigin;
  className?: string;
  decoration?: ReactNode;
  children: ReactNode;
};

export const menuItem =
  "flex h-11 w-full items-center px-4 text-left text-base font-bold text-foreground outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-menu-hover focus-visible:bg-menu-hover focus-visible:shadow-[inset_0_0_0_2px_var(--color-menu-focus-ring)] active:bg-menu-pressed";

export function DropdownMenu<Placement>({
  menu,
  label,
  style,
  origin,
  className,
  decoration,
  children,
}: DropdownMenuProps<Placement>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { state, isOpen, close, finishClosing, onMenuKeyDown } = menu;
  const onClosed = useEffectEvent(finishClosing);

  useEffect(() => {
    if (isOpen) {
      menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (state !== "closing") return;
    const timeout = window.setTimeout(
      onClosed,
      readCssMilliseconds("--dropdown-close-dur"),
    );
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
        inert={!isOpen}
        style={style}
        data-origin={origin}
        onTransitionEnd={(event) => {
          if (event.target === event.currentTarget) finishClosing();
        }}
        className={cn(
          "t-dropdown fixed z-30",
          isOpen ? "is-open" : "is-closing",
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
