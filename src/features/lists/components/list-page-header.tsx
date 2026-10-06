"use client";

import { startTransition, useOptimistic } from "react";
import type { List } from "@/types/list";
import { routes } from "@/config/routes";
import { BackButton } from "@/components/layout/back-button";
import { MenuItem } from "@/components/ui/dropdown-menu";
import {
  BlockIcon,
  ChatIcon,
  CircleXIcon,
  FlagIcon,
  LinkIcon,
  LockIcon,
  MoreHorizontalIcon,
  ShareIcon,
} from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { toggleListHiddenFromForYou } from "@/features/lists/api/list-viewer-state";
import { HeaderMenu } from "@/features/lists/components/header-menu";

type ListPageHeaderProps = {
  list: List;
  isOwner: boolean;
};

function listUrl(listId: string) {
  return `${window.location.origin}${routes.list(listId)}`;
}

async function copyListLink(listId: string) {
  try {
    await navigator.clipboard.writeText(listUrl(listId));
    showToast({ message: "Copied to clipboard" });
  } catch {
    showToast({ message: "Couldn’t copy the link" });
  }
}

async function shareList(list: List) {
  if (typeof navigator.share !== "function") {
    await copyListLink(list.id);
    return;
  }
  await navigator
    .share({ title: list.name, url: listUrl(list.id) })
    .catch(() => undefined);
}

export function ListPageHeader({ list, isOwner }: ListPageHeaderProps) {
  const [hidden, setHidden] = useOptimistic(list.hiddenFromForYou);

  function toggleForYou() {
    startTransition(async () => {
      setHidden(!hidden);
      await toggleListHiddenFromForYou(list.id);
    });
  }

  return (
    <div className="sticky top-0 z-3 bg-background/65 backdrop-blur-[12px]">
      <div className="flex h-[53px] items-center px-4">
        <div className="min-w-14">
          <BackButton />
        </div>
        <div className="flex min-w-0 grow flex-col">
          <h2 className="flex min-w-0 items-center py-0.5 text-xl font-bold">
            <span className="truncate">{list.name}</span>
            {list.private ? (
              <LockIcon
                role="img"
                aria-hidden={false}
                aria-label="Private List"
                className="ml-0.5 size-5 shrink-0"
              />
            ) : null}
          </h2>
          <span className="truncate text-xs text-muted">
            @{list.owner.handle}
          </span>
        </div>
        <div className="ml-4 flex shrink-0 items-center gap-2">
          <HeaderMenu
            label="Share"
            menuLabel="Share Menu"
            icon={<ShareIcon className="size-5" />}
            size={{ width: 250, height: 132 }}
          >
            {(select) => (
              <>
                <MenuItem
                  label="Send via Chat"
                  icon={<ChatIcon />}
                  href={routes.chat}
                  onSelect={select}
                />
                <MenuItem
                  label="Copy link to List"
                  icon={<LinkIcon />}
                  onSelect={(event) => select(event, () => void copyListLink(list.id))}
                />
                <MenuItem
                  label="Share List"
                  icon={<ShareIcon />}
                  onSelect={(event) => select(event, () => void shareList(list))}
                />
              </>
            )}
          </HeaderMenu>
          <HeaderMenu
            label="More"
            menuLabel="List options"
            icon={<MoreHorizontalIcon className="size-5" />}
            size={{ width: 384, height: isOwner ? 72 : 116 }}
          >
            {(select) =>
              isOwner ? (
                <MenuItem
                  label={
                    hidden
                      ? "Show these posts in For you"
                      : "Don’t show these posts in For you"
                  }
                  description={
                    hidden
                      ? "Top posts from this List can show up in your For you timeline."
                      : "Top posts from this List will no longer show up in your For you timeline."
                  }
                  icon={<CircleXIcon />}
                  onSelect={(event) => select(event, toggleForYou)}
                />
              ) : (
                <>
                  <MenuItem
                    label="Report List"
                    icon={<FlagIcon />}
                    onSelect={(event) =>
                      select(event, () =>
                        showToast({ message: "Thanks for letting us know." }),
                      )
                    }
                  />
                  <MenuItem
                    label={`Block @${list.owner.handle}`}
                    description={`This prevents @${list.owner.handle} from including you in any of their Lists, including this one.`}
                    icon={<BlockIcon />}
                    onSelect={(event) =>
                      select(event, () =>
                        showToast({ message: `@${list.owner.handle} has been blocked.` }),
                      )
                    }
                  />
                </>
              )
            }
          </HeaderMenu>
        </div>
      </div>
    </div>
  );
}
