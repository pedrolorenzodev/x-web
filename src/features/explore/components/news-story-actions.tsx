"use client";

import { useRouter } from "next/navigation";
import { useRef, type MouseEvent } from "react";
import { routes } from "@/config/routes";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";
import {
  ChatBubbleIcon,
  FlagIcon,
  FrownIcon,
  LinkIcon,
  MoreHorizontalIcon,
  QuotePencilIcon,
  ShareIcon,
} from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

const SHARE_MENU_SIZE = { width: 200, height: 176 };
const MORE_MENU_SIZE = { width: 240, height: 44 };

function storyUrl(path: string) {
  return new URL(path, window.location.origin).toString();
}

async function copyToClipboard(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    showToast({ message: "Copied to clipboard" });
  } catch {
    showToast({ message: "Couldn’t copy the link" });
  }
}

function ShareStoryMenu({ path }: { path: string }) {
  const router = useRouter();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, (anchor) =>
    placeOverAnchor(anchor, SHARE_MENU_SIZE, "right"),
  );

  function postThis(event: MouseEvent<HTMLElement>) {
    menu.selectItem(event);
    const params = new URLSearchParams({ text: storyUrl(path) });
    router.push(`${routes.composePost}?${params.toString()}`);
  }

  function copyLink(event: MouseEvent<HTMLElement>) {
    menu.selectItem(event);
    void copyToClipboard(storyUrl(path));
  }

  function shareVia(event: MouseEvent<HTMLElement>) {
    menu.selectItem(event);
    if (navigator.share) {
      navigator.share({ url: storyUrl(path) }).catch(() => {});
    } else {
      void copyToClipboard(storyUrl(path));
    }
  }

  return (
    <>
      <Tooltip label="Share">
        <IconButton
          ref={anchorRef}
          label="Share Menu"
          tone="plain"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className="size-9"
        >
          <ShareIcon className="size-5" />
        </IconButton>
      </Tooltip>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Share story"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max min-w-[200px]"
          menuClassName="rounded-xl py-0"
        >
          <MenuItem label="Post this" icon={<QuotePencilIcon />} onSelect={postThis} />
          <MenuItem
            label="Send via Chat"
            icon={<ChatBubbleIcon />}
            href={routes.chatShare}
            onSelect={menu.selectItem}
          />
          <MenuItem label="Copy link" icon={<LinkIcon />} onSelect={copyLink} />
          <MenuItem label="Share via..." icon={<ShareIcon />} onSelect={shareVia} />
        </DropdownMenu>
      ) : null}
    </>
  );
}

function MoreStoryMenu() {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, (anchor) =>
    placeOverAnchor(anchor, MORE_MENU_SIZE, "right"),
  );

  return (
    <>
      <Tooltip label="More">
        <IconButton
          ref={anchorRef}
          label="More"
          tone="plain"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className="size-9"
        >
          <MoreHorizontalIcon className="size-5" />
        </IconButton>
      </Tooltip>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="More story options"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max min-w-[240px]"
          menuClassName="rounded-xl py-0"
        >
          <MenuItem
            label="Not interested in this"
            icon={<FrownIcon />}
            onSelect={(event) => {
              menu.selectItem(event);
              showToast({ message: "Thanks. You’ll see fewer stories like this." });
            }}
          />
        </DropdownMenu>
      ) : null}
    </>
  );
}

export function NewsStoryActions({ path }: { path: string }) {
  return (
    <div className="mr-[7px] flex items-center">
      <Tooltip label="Report">
        <IconButton
          label="Report Trend"
          tone="plain"
          onClick={() =>
            showToast({ message: "Thanks for letting us know about this story." })
          }
          className="size-9"
        >
          <FlagIcon className="size-5" />
        </IconButton>
      </Tooltip>
      <ShareStoryMenu path={path} />
      <MoreStoryMenu />
    </div>
  );
}
