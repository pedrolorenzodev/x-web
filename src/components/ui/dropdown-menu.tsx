"use client";

import Link from "next/link";
import {
  useEffect,
  useEffectEvent,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { CheckIcon } from "@/components/ui/icons";
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
  menuClassName?: string;
  decoration?: ReactNode;
  children: ReactNode;
};

export type MenuPlacement = {
  style: CSSProperties;
  origin: DropdownOrigin;
};

export function placeOverAnchor(
  anchor: DOMRect,
  size: { width: number; height: number },
  align: "left" | "right" = "left",
): MenuPlacement {
  const leftAligned =
    align === "left"
      ? anchor.left + size.width <= window.innerWidth
      : anchor.right - size.width < 0;
  const fitsBelow = anchor.top + size.height <= window.innerHeight;
  return {
    style: {
      ...(leftAligned
        ? { left: anchor.left }
        : { right: window.innerWidth - anchor.right }),
      ...(fitsBelow
        ? { top: anchor.top }
        : { bottom: window.innerHeight - anchor.bottom }),
    },
    origin: `${fitsBelow ? "top" : "bottom"}-${leftAligned ? "left" : "right"}`,
  };
}

export const menuItem =
  "flex h-11 w-full items-center px-4 text-left text-base font-bold text-foreground outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-menu-hover focus-visible:bg-menu-hover focus-visible:shadow-[inset_0_0_0_2px_var(--color-menu-focus-ring)] active:bg-menu-pressed";

export function DropdownMenu<Placement>({
  menu,
  label,
  style,
  origin,
  className,
  menuClassName,
  decoration,
  children,
}: DropdownMenuProps<Placement>) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { state, isOpen, close, finishClosing, onMenuKeyDown } = menu;
  const onClosed = useEffectEvent(finishClosing);

  useEffect(() => {
    if (isOpen) {
      menuRef.current?.querySelector<HTMLElement>("[role^=menuitem]")?.focus();
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
          className="fixed inset-0 z-50"
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
          "t-dropdown fixed z-50",
          isOpen ? "is-open" : "is-closing",
          className,
        )}
      >
        <div
          ref={menuRef}
          role="menu"
          aria-label={label}
          onKeyDown={onMenuKeyDown}
          className={cn(
            "max-h-[480px] overflow-auto rounded-2xl bg-elevated py-3 shadow-menu",
            menuClassName,
          )}
        >
          {children}
        </div>
        {decoration}
      </div>
    </>,
    document.body,
  );
}

type MenuItemProps = {
  label: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  checked?: boolean;
  tone?: "default" | "danger";
  size?: "md" | "lg";
  href?: string;
  external?: boolean;
  onSelect: (event: MouseEvent<HTMLElement>) => void;
};

export function MenuItem({
  label,
  icon,
  description,
  checked,
  tone = "default",
  size = "md",
  href,
  external = false,
  onSelect,
}: MenuItemProps) {
  const className = cn(
    menuItem,
    "gap-3",
    size === "lg" && "h-14 gap-6 p-4 text-xl",
    description && "h-auto py-3",
    tone === "danger" && "text-danger",
  );
  const content = (
    <>
      {icon ? (
        <span
          className={cn(
            "flex shrink-0 items-center",
            size === "lg" ? "size-6 [&>svg]:size-6" : "[&>svg]:size-[18.75px]",
          )}
        >
          {icon}
        </span>
      ) : null}
      <span className="flex min-w-0 grow flex-col">
        <span className="truncate">{label}</span>
        {description ? (
          <span className="text-xs leading-4 font-normal text-muted">
            {description}
          </span>
        ) : null}
      </span>
      {checked ? (
        <CheckIcon className="size-[18.75px] shrink-0 text-accent" />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        role="menuitem"
        onClick={onSelect}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      role={checked === undefined ? "menuitem" : "menuitemradio"}
      aria-checked={checked}
      onClick={onSelect}
      className={className}
    >
      {content}
    </button>
  );
}
