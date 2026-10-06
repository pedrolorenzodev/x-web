"use client";

import { useState } from "react";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { IconButton } from "@/components/ui/icon-button";
import {
  BookmarkIcon,
  InfoIcon,
  LikeIcon,
  SearchIcon,
} from "@/components/ui/icons";
import { Tab } from "@/components/ui/tab";
import { Tooltip } from "@/components/ui/tooltip";
import type { HistoryTab } from "@/features/history/types/history-tab";
import { LikesInfoModal } from "@/features/history/components/likes-info-modal";

type HistoryHeaderProps = {
  tab: HistoryTab;
  onSearch?: () => void;
};

const actionClassName = "-mr-[5px] size-9";

export function HistoryHeader({ tab, onSearch }: HistoryHeaderProps) {
  const [infoOpen, setInfoOpen] = useState(false);

  const action =
    tab === "bookmarks" ? (
      <Tooltip label="Search Bookmarks">
        <IconButton
          label="Search Bookmarks"
          tone="plain"
          onClick={onSearch}
          className={actionClassName}
        >
          <SearchIcon className="size-5" />
        </IconButton>
      </Tooltip>
    ) : (
      <Tooltip label="Information">
        <IconButton
          label="Information"
          tone="plain"
          onClick={() => setInfoOpen(true)}
          className={actionClassName}
        >
          <InfoIcon className="size-5" />
        </IconButton>
      </Tooltip>
    );

  return (
    <>
      <PageHeader title="History" action={action}>
        <div role="tablist" className="flex border-b border-border">
          <Tab
            label="Bookmarks"
            href={routes.history}
            active={tab === "bookmarks"}
            leadingIcon={<BookmarkIcon className="size-[18.75px]" />}
          />
          <Tab
            label="Likes"
            href={routes.historyLikes}
            active={tab === "likes"}
            leadingIcon={<LikeIcon className="size-[18.75px]" />}
          />
        </div>
      </PageHeader>
      {infoOpen ? <LikesInfoModal onClose={() => setInfoOpen(false)} /> : null}
    </>
  );
}
