"use client";

import { useRef, useState, type MouseEvent } from "react";
import { routes } from "@/config/routes";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import {
  BlockIcon,
  FlagIcon,
  InfoIcon,
  LinkIcon,
  ListPlusIcon,
  ListsIcon,
  MoreHorizontalIcon,
  MuteIcon,
  ShareIcon,
} from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { ReportModal } from "@/components/tweet/report-modal";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";
import { circleButton } from "@/features/profile/components/circle-button";

const ITEM_HEIGHT = 44;
const MENU_WIDTH = 229;

type Dialog = "block" | "report" | null;

type ProfileMoreMenuProps = {
  handle: string;
  isProtected: boolean;
};

function profileUrl(handle: string) {
  return `${window.location.origin}${routes.profile(handle)}`;
}

async function copyProfileLink(handle: string) {
  await navigator.clipboard.writeText(profileUrl(handle));
  showToast({ message: "Copied to clipboard" });
}

export function ProfileMoreMenu({ handle, isProtected }: ProfileMoreMenuProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const itemCount = isProtected ? 4 : 8;
  const menu = useDropdownMenu(anchorRef, (anchor) =>
    placeOverAnchor(
      anchor,
      { width: MENU_WIDTH, height: itemCount * ITEM_HEIGHT },
      "right",
    ),
  );
  const [dialog, setDialog] = useState<Dialog>(null);
  const [muted, setMuted] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const mention = `@${handle}`;

  function select(event: MouseEvent<HTMLElement>, action: () => void) {
    menu.selectItem(event);
    action();
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    showToast({
      message: next
        ? `${mention} has been muted.`
        : `${mention} has been unmuted.`,
      action: next
        ? { label: "Undo", onClick: () => setMuted(false) }
        : undefined,
    });
  }

  function block() {
    setDialog(null);
    setBlocked(true);
    showToast({
      message: `${mention} has been blocked.`,
      action: { label: "Undo", onClick: () => setBlocked(false) },
    });
  }

  function unblock() {
    setBlocked(false);
    showToast({ message: `${mention} has been unblocked.` });
  }

  async function share() {
    const url = profileUrl(handle);
    if (navigator.share) {
      await navigator.share({ url }).catch(() => undefined);
      return;
    }
    await copyProfileLink(handle);
  }

  return (
    <>
      <Tooltip label="More">
        <button
          ref={anchorRef}
          type="button"
          aria-label="More"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={menu.toggle}
          className={circleButton}
        >
          <MoreHorizontalIcon className="size-5" />
        </button>
      </Tooltip>

      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Profile options"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max min-w-[229px]"
          menuClassName="rounded-xl py-0"
        >
          <MenuItem
            label="About this account"
            icon={<InfoIcon />}
            href={routes.profileAbout(handle)}
            onSelect={menu.selectItem}
          />
          {isProtected ? null : (
            <>
              <MenuItem
                label="Add/remove from Lists"
                icon={<ListPlusIcon />}
                href={routes.listAddMember}
                onSelect={menu.selectItem}
              />
              <MenuItem
                label="View Lists"
                icon={<ListsIcon />}
                href={routes.lists(handle)}
                onSelect={menu.selectItem}
              />
              <MenuItem
                label={`Share ${mention} via...`}
                icon={<ShareIcon />}
                onSelect={(event) => select(event, () => void share())}
              />
              <MenuItem
                label="Copy link to profile"
                icon={<LinkIcon />}
                onSelect={(event) =>
                  select(event, () => void copyProfileLink(handle))
                }
              />
            </>
          )}
          <MenuItem
            label={muted ? `Unmute ${mention}` : "Mute"}
            icon={<MuteIcon />}
            onSelect={(event) => select(event, toggleMute)}
          />
          <MenuItem
            label={blocked ? `Unblock ${mention}` : `Block ${mention}`}
            icon={<BlockIcon />}
            onSelect={(event) =>
              select(event, blocked ? unblock : () => setDialog("block"))
            }
          />
          <MenuItem
            label={`Report ${mention}`}
            icon={<FlagIcon />}
            onSelect={(event) => select(event, () => setDialog("report"))}
          />
        </DropdownMenu>
      ) : null}

      {dialog === "block" ? (
        <ConfirmSheet
          title={`Block ${mention}?`}
          body={`They will be able to see your public posts, but will no longer be able to engage with them. ${mention} will also not be able to follow or message you, and you will not see notifications from them.`}
          confirmLabel="Block"
          tone="danger"
          onCancel={() => setDialog(null)}
          onConfirm={block}
        />
      ) : null}
      {dialog === "report" ? (
        <ReportModal onClose={() => setDialog(null)} />
      ) : null}
    </>
  );
}
