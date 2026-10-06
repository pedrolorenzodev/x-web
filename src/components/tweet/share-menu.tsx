"use client";

import type { MouseEvent } from "react";
import { routes } from "@/config/routes";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import { ChatBubbleIcon, LinkIcon, ShareIcon } from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import type { DropdownMenuController } from "@/hooks/use-dropdown-menu";

const MENU_SIZE = { width: 180, height: 156 };

export function placeShareMenu(anchor: DOMRect): MenuPlacement {
  return placeOverAnchor(anchor, MENU_SIZE, "right");
}

type ShareMenuProps = {
  menu: DropdownMenuController<MenuPlacement>;
  path: string;
};

async function copyToClipboard(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    showToast({ message: "Copied to clipboard" });
  } catch {
    showToast({ message: "Couldn’t copy the link" });
  }
}

export function ShareMenu({ menu, path }: ShareMenuProps) {
  if (!menu.placement) return null;

  function url() {
    return new URL(path, window.location.origin).toString();
  }

  function copyLink(event: MouseEvent<HTMLElement>) {
    menu.selectItem(event);
    void copyToClipboard(url());
  }

  function shareVia(event: MouseEvent<HTMLElement>) {
    menu.selectItem(event);
    if (navigator.share) {
      navigator.share({ url: url() }).catch(() => {});
    } else {
      void copyToClipboard(url());
    }
  }

  return (
    <DropdownMenu
      menu={menu}
      label="Share post"
      style={menu.placement.style}
      origin={menu.placement.origin}
      className="w-max min-w-[180px]"
      menuClassName="rounded-xl py-0"
    >
      <MenuItem
        label="Send via Chat"
        icon={<ChatBubbleIcon />}
        href={routes.chat}
        onSelect={menu.selectItem}
      />
      <MenuItem label="Copy link" icon={<LinkIcon />} onSelect={copyLink} />
      <MenuItem
        label="Share post via …"
        icon={<ShareIcon />}
        onSelect={shareVia}
      />
    </DropdownMenu>
  );
}
