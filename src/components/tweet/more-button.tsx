"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { Tweet } from "@/types/tweet";
import { routes } from "@/config/routes";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import {
  DropdownMenu,
  MenuItem,
  placeOverAnchor,
} from "@/components/ui/dropdown-menu";
import {
  BlockIcon,
  EmbedIcon,
  FlagIcon,
  FollowUserIcon,
  ListPlusIcon,
  MoreHorizontalIcon,
  MuteIcon,
  NotInterestedIcon,
  PinIcon,
  TrashIcon,
  UnfollowIcon,
  ViewsIcon,
} from "@/components/ui/icons";
import { showToast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { EmbedModal } from "@/components/tweet/embed-modal";
import { ReportModal } from "@/components/tweet/report-modal";
import { useTweetVisibility } from "@/components/tweet/tweet-article";
import { useTweetServices } from "@/components/tweet/tweet-services-context";
import { useUserCardServices } from "@/components/user/user-card-context";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

const MENU_SIZE = { width: 260, height: 352 };

type Dialog = "block" | "delete" | "embed" | "report" | null;

type MoreButtonProps = {
  tweet: Tweet;
};

export function MoreButton({ tweet }: MoreButtonProps) {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menu = useDropdownMenu(anchorRef, (anchor) =>
    placeOverAnchor(anchor, MENU_SIZE, "right"),
  );
  const users = useUserCardServices();
  const tweets = useTweetServices();
  const visibility = useTweetVisibility();
  const [following, setFollowing] = useState<boolean | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);

  const { author } = tweet;
  const handle = `@${author.handle}`;
  const isOwn = users?.viewerId === author.id;
  const pinned = tweets?.pinnedTweetId === tweet.id;
  const tweetPath = routes.tweet(author.handle, tweet.id);

  function open(event: MouseEvent<HTMLButtonElement>) {
    if (!menu.isOpen && users && !isOwn && following === null) {
      users.loadUserCard(author.handle).then((user) => {
        setFollowing(user?.followedByViewer ?? false);
      });
    }
    menu.toggle(event);
  }

  function select(event: MouseEvent<HTMLElement>, action: () => void) {
    menu.selectItem(event);
    action();
  }

  function hideWithUndo(message: string) {
    visibility?.hide();
    showToast({
      message,
      action: { label: "Undo", onClick: () => visibility?.show() },
    });
  }

  function toggleFollow() {
    if (!users) return;
    setFollowing((current) => !current);
    void users.toggleFollow(author.id);
  }

  async function togglePin() {
    if (!tweets) return;
    await tweets.togglePinTweet(tweet.id);
    showToast({
      message: pinned
        ? "Your post was unpinned from your profile."
        : "Your post was pinned to your profile.",
    });
  }

  async function deletePost() {
    setDialog(null);
    visibility?.hide();
    await tweets?.deleteTweet(tweet.id);
    showToast({ message: "Your post was deleted" });
  }

  const items: { key: string; node: ReactNode }[] = isOwn
    ? [
        {
          key: "delete",
          node: (
            <MenuItem
              label="Delete"
              tone="danger"
              icon={<TrashIcon />}
              onSelect={(event) => select(event, () => setDialog("delete"))}
            />
          ),
        },
        {
          key: "pin",
          node: (
            <MenuItem
              label={pinned ? "Unpin from profile" : "Pin to your profile"}
              icon={<PinIcon />}
              onSelect={(event) => select(event, () => void togglePin())}
            />
          ),
        },
      ]
    : [
        {
          key: "not-interested",
          node: (
            <MenuItem
              label="Not interested in this post"
              icon={<NotInterestedIcon />}
              onSelect={(event) =>
                select(event, () =>
                  hideWithUndo("Thanks. You’ll see fewer posts like this."),
                )
              }
            />
          ),
        },
        {
          key: "follow",
          node: (
            <MenuItem
              label={`${following ? "Unfollow" : "Follow"} ${handle}`}
              icon={following ? <UnfollowIcon /> : <FollowUserIcon />}
              onSelect={(event) => select(event, toggleFollow)}
            />
          ),
        },
        {
          key: "lists",
          node: (
            <MenuItem
              label="Add/remove from Lists"
              icon={<ListPlusIcon />}
              href={`${routes.listAddMember}?user_id=${author.id}`}
              onSelect={menu.selectItem}
            />
          ),
        },
        {
          key: "mute",
          node: (
            <MenuItem
              label="Mute"
              icon={<MuteIcon />}
              onSelect={(event) =>
                select(event, () => hideWithUndo(`${handle} has been muted.`))
              }
            />
          ),
        },
        {
          key: "block",
          node: (
            <MenuItem
              label={`Block ${handle}`}
              icon={<BlockIcon />}
              onSelect={(event) => select(event, () => setDialog("block"))}
            />
          ),
        },
      ];

  const shared = [
    {
      key: "activity",
      node: (
        <MenuItem
          label="View post activity"
          icon={<ViewsIcon />}
          href={routes.tweetQuotes(author.handle, tweet.id)}
          onSelect={menu.selectItem}
        />
      ),
    },
    {
      key: "embed",
      node: (
        <MenuItem
          label="Embed post"
          icon={<EmbedIcon />}
          onSelect={(event) => select(event, () => setDialog("embed"))}
        />
      ),
    },
    ...(isOwn
      ? []
      : [
          {
            key: "report",
            node: (
              <MenuItem
                label="Report post"
                icon={<FlagIcon />}
                onSelect={(event) => select(event, () => setDialog("report"))}
              />
            ),
          },
        ]),
  ];

  return (
    <>
      <Tooltip label="More">
        <button
          ref={anchorRef}
          type="button"
          aria-label="More"
          aria-haspopup="menu"
          aria-expanded={menu.isOpen}
          onClick={open}
          className="group/more relative flex h-5 shrink-0 items-center text-muted transition-colors duration-200 ease-[ease] hover:text-accent"
        >
          <span className="relative flex size-[18.75px]">
            <span className="absolute -inset-2 rounded-full transition-colors duration-200 ease-[ease] group-hover/more:bg-accent/10" />
            <MoreHorizontalIcon className="relative size-[18.75px]" />
          </span>
        </button>
      </Tooltip>

      {menu.placement ? (
        <DropdownMenu
          menu={menu}
          label="Post options"
          style={menu.placement.style}
          origin={menu.placement.origin}
          className="w-max min-w-[250px]"
          menuClassName="rounded-xl py-0"
        >
          {[...items, ...shared].map((item) => (
            <div key={item.key} className="contents">
              {item.node}
            </div>
          ))}
        </DropdownMenu>
      ) : null}

      {dialog === "block" ? (
        <ConfirmSheet
          title={`Block ${handle}?`}
          body={`They will be able to see your public posts, but will no longer be able to engage with them. ${handle} will also not be able to follow or message you, and you will not see notifications from them.`}
          confirmLabel="Block"
          tone="danger"
          onCancel={() => setDialog(null)}
          onConfirm={() => {
            setDialog(null);
            hideWithUndo(`${handle} has been blocked.`);
          }}
        />
      ) : null}
      {dialog === "delete" ? (
        <ConfirmSheet
          title="Delete post?"
          body="This can’t be undone and it will be removed from your profile, the timeline of any accounts that follow you, and from search results."
          confirmLabel="Delete"
          tone="danger"
          onCancel={() => setDialog(null)}
          onConfirm={() => void deletePost()}
        />
      ) : null}
      {dialog === "embed" ? (
        <EmbedModal tweet={tweet} path={tweetPath} onClose={() => setDialog(null)} />
      ) : null}
      {dialog === "report" ? (
        <ReportModal onClose={() => setDialog(null)} />
      ) : null}
    </>
  );
}
