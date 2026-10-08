"use client";

import { useRef, type ComponentType, type SVGProps } from "react";
import type { ReplySettings } from "@/types/tweet";
import {
  CheckIcon,
  FollowingCheckFilledIcon,
  FollowingCheckIcon,
  GlobeIcon,
  GroupIcon,
  MentionIcon,
  PremiumIcon,
} from "@/components/ui/icons";
import {
  DropdownMenu,
  placeOverAnchor,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { cn } from "@/lib/utils";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

type AudienceOption = {
  value: ReplySettings;
  label: string;
  buttonLabel: string;
  icon: Icon;
  buttonIcon: Icon;
};

const options: AudienceOption[] = [
  {
    value: "everyone",
    label: "Everyone",
    buttonLabel: "Everyone can reply",
    icon: GlobeIcon,
    buttonIcon: GlobeIcon,
  },
  {
    value: "following",
    label: "Accounts you follow",
    buttonLabel: "Accounts you follow can reply",
    icon: FollowingCheckIcon,
    buttonIcon: FollowingCheckFilledIcon,
  },
  {
    value: "following_extended",
    label: "Accounts you follow and who they follow",
    buttonLabel: "Accounts you follow and who they follow can reply",
    icon: GroupIcon,
    buttonIcon: GroupIcon,
  },
  {
    value: "mentioned",
    label: "Only accounts you mention",
    buttonLabel: "Only accounts you mention can reply",
    icon: MentionIcon,
    buttonIcon: MentionIcon,
  },
  {
    value: "verified",
    label: "Verified accounts",
    buttonLabel: "Verified accounts can reply",
    icon: PremiumIcon,
    buttonIcon: PremiumIcon,
  },
];

const MENU_SIZE = { width: 360, height: 332 };
const MENU_OFFSET = 22;
const MENU_SHIFT_LEFT = 70;

function placeMenu(anchor: DOMRect): MenuPlacement {
  const below = new DOMRect(
    anchor.left - MENU_SHIFT_LEFT,
    anchor.bottom + MENU_OFFSET,
    anchor.width,
    0,
  );
  return placeOverAnchor(below, MENU_SIZE);
}

type AudienceMenuProps = {
  value: ReplySettings;
  onChange: (value: ReplySettings) => void;
};

export function AudienceMenu({ value, onChange }: AudienceMenuProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, placeMenu);
  const selected = options.find((option) => option.value === value) ?? options[0];
  const ButtonIcon = selected.buttonIcon;

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={menu.isOpen}
        onClick={menu.toggle}
        className="inline-flex h-6 max-w-full items-center gap-1 rounded-full border border-transparent px-3 text-sm font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
      >
        <ButtonIcon className="size-4 shrink-0" />
        <span className="truncate">{selected.buttonLabel}</span>
      </button>

      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Who can reply?"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-[360px]"
          menuClassName="px-4 py-6"
        >
          <h2 className="pb-2 text-lg font-bold">Who can reply?</h2>
          {options.map((option) => {
            const checked = option.value === value;
            const OptionIcon = option.icon;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitemradio"
                aria-checked={checked}
                onClick={(event) => {
                  menu.selectItem(event);
                  onChange(option.value);
                }}
                className="-mx-4 flex min-h-12 w-[calc(100%+2rem)] items-start gap-5 px-4 py-3 text-left outline-none transition-colors duration-200 ease-[ease] hover:bg-menu-hover focus-visible:bg-menu-hover focus-visible:shadow-[inset_0_0_0_2px_var(--color-menu-focus-ring)]"
              >
                <OptionIcon className="size-5 shrink-0" />
                <span className="flex min-h-6 min-w-0 flex-1 items-center text-base font-bold">
                  {option.label}
                </span>
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full",
                    checked ? "bg-accent" : "border-2 border-muted",
                  )}
                >
                  {checked ? <CheckIcon className="size-4 text-white" /> : null}
                </span>
              </button>
            );
          })}
        </DropdownMenu>
      ) : null}
    </>
  );
}
