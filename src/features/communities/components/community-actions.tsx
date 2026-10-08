"use client";

import { startTransition, useOptimistic, useRef, type ReactNode } from "react";
import type { Community } from "@/types/community";
import { routes } from "@/config/routes";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
  type MenuPlacement,
} from "@/components/ui/dropdown-menu";
import {
  ChatIcon,
  LinkIcon,
  ShareIcon,
  SparkleIcon,
} from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import {
  toggleCommunityMembership,
  toggleCommunityPin,
} from "@/features/communities/api/community-mutations";
import { cn } from "@/lib/utils";

const SHARE_MENU_SIZE = { width: 260, height: 132 };

const circle =
  "flex size-9 items-center justify-center rounded-full border border-outline transition-colors duration-200 ease-[ease] hover:bg-foreground/10";

function communityUrl(id: string) {
  return `${window.location.origin}${routes.community(id)}`;
}

async function copyLink(id: string) {
  try {
    await navigator.clipboard.writeText(communityUrl(id));
    showToast({ message: "Copied to clipboard" });
  } catch {
    showToast({ message: "Couldn’t copy the link" });
  }
}

async function shareCommunity(community: Community) {
  if (typeof navigator.share !== "function") {
    await copyLink(community.id);
    return;
  }
  await navigator
    .share({ title: community.name, url: communityUrl(community.id) })
    .catch(() => undefined);
}

function PinButton({ community }: { community: Community }) {
  const [pinned, setPinned] = useOptimistic(community.pinnedByViewer);
  const label = pinned ? "Unpin Community" : "Pin Community";

  return (
    <Tooltip label={label}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={pinned}
        onClick={() =>
          startTransition(async () => {
            setPinned(!pinned);
            await toggleCommunityPin(community.id);
          })
        }
        className={cn(circle, pinned && "border-accent text-accent")}
      >
        <SparkleIcon className="size-5" />
      </button>
    </Tooltip>
  );
}

function ShareMenu({ community }: { community: Community }) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu<MenuPlacement>(anchorRef, (anchor) =>
    placeOverAnchor(anchor, SHARE_MENU_SIZE, "right"),
  );

  function select(event: Parameters<typeof menu.selectItem>[0], action: () => void) {
    menu.selectItem(event);
    action();
  }

  return (
    <>
      <Tooltip label="Share Community">
        <button
          ref={anchorRef}
          type="button"
          aria-label="Share Community"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className={circle}
        >
          <ShareIcon className="size-5" />
        </button>
      </Tooltip>
      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Share Community"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max min-w-[200px]"
          menuClassName="rounded-xl py-0"
        >
          <MenuItem
            label="Send via Chat"
            icon={<ChatIcon />}
            href={routes.chatShare}
            onSelect={menu.selectItem}
          />
          <MenuItem
            label="Copy link to Community"
            icon={<LinkIcon />}
            onSelect={(event) => select(event, () => void copyLink(community.id))}
          />
          <MenuItem
            label="Share Community via…"
            icon={<ShareIcon />}
            onSelect={(event) =>
              select(event, () => void shareCommunity(community))
            }
          />
        </DropdownMenu>
      ) : null}
    </>
  );
}

function JoinButton({ community }: { community: Community }) {
  const [role, setRole] = useOptimistic(community.viewerRole);
  const staff = role === "admin" || role === "moderator";

  function toggle() {
    if (staff) return;
    startTransition(async () => {
      setRole(role ? null : "member");
      await toggleCommunityMembership(community.id);
    });
  }

  let label: ReactNode = "Join";
  if (role) {
    label = (
      <span className="grid">
        <span className="col-start-1 row-start-1 group-hover/join:invisible">
          Joined
        </span>
        <span className="invisible col-start-1 row-start-1 group-hover/join:visible">
          Leave
        </span>
      </span>
    );
  }

  return (
    <button
      type="button"
      aria-label={role ? `Leave ${community.name}` : `Join ${community.name}`}
      onClick={toggle}
      disabled={staff}
      className={cn(
        "group/join flex h-9 items-center rounded-full border px-4 text-base font-bold transition-colors duration-200 ease-[ease]",
        role
          ? "border-outline hover:border-danger-border hover:bg-danger/10 hover:text-danger"
          : "border-outline hover:bg-foreground/10",
      )}
    >
      {label}
    </button>
  );
}

export function CommunityActions({ community }: { community: Community }) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <PinButton community={community} />
      <ShareMenu community={community} />
      <JoinButton community={community} />
    </div>
  );
}
