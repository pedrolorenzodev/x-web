"use client";

import { useRef } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  GrokIcon,
  LightningIcon,
} from "@/components/ui/icons";
import {
  DropdownMenu,
  menuItem,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { grokLinks, grokModel } from "@/features/grok/config/grok";
import { cn } from "@/lib/utils";

const MENU_WIDTH = 280;
const MENU_GAP = 4;

function placeBelowRight(anchor: DOMRect): MenuPlacement {
  return {
    style: {
      left: Math.max(8, anchor.right - MENU_WIDTH),
      top: anchor.bottom + MENU_GAP,
    },
    origin: "top-right",
  };
}

export function GrokModelMenu() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, placeBelowRight);

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-label={grokModel.name}
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className="flex h-[35px] shrink-0 items-center gap-2 rounded-full border border-transparent px-3 text-sm font-bold transition-colors duration-200 ease-[ease] hover:bg-white/10"
      >
        <LightningIcon className="size-4" />
        {grokModel.name}
        <ChevronDownIcon
          className={cn(
            "size-3.5 transition-transform duration-200 ease-[ease]",
            menu.isOpen && "rotate-180",
          )}
        />
      </button>

      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Grok models"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-[280px]"
          menuClassName="py-0"
        >
          <button
            type="button"
            role="menuitemradio"
            aria-checked
            onClick={menu.selectItem}
            className={cn(menuItem, "h-auto gap-3 py-3")}
          >
            <LightningIcon className="size-5 shrink-0" />
            <span className="flex min-w-0 grow flex-col">
              <span>{grokModel.name}</span>
              <span className="text-sm font-normal text-muted">
                {grokModel.description}
              </span>
            </span>
            <CheckIcon className="size-[18.75px] shrink-0 text-accent" />
          </button>
          <div aria-hidden className="h-px bg-border" />
          <a
            href={grokLinks.grokCom}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            onClick={menu.selectItem}
            className={cn(menuItem, "gap-3 text-sm")}
          >
            <GrokIcon className="h-5 w-[20.6px] shrink-0" />
            Go to grok.com
          </a>
        </DropdownMenu>
      ) : null}
    </>
  );
}
