"use client";

import {
  startTransition,
  useId,
  useOptimistic,
  useState,
  type ReactNode,
} from "react";
import { ListThumbnail } from "@/components/list/list-cover";
import { IconButton } from "@/components/ui/icon-button";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  CloseIcon,
  LockIcon,
  PinMinusIcon,
  PinPlusIcon,
} from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { TimelineList } from "@/features/feed/types/timeline-list";
import { toggleTimelinePin } from "@/features/feed/api/toggle-timeline-pin";

type ManageTimelinesModalProps = {
  lists: TimelineList[];
  onClose: () => void;
};

const sectionHeading = "flex h-[52px] w-full items-center justify-between px-4 text-lg font-bold";

function NothingToShow() {
  return <p className="px-4 pt-1 pb-5 text-sm text-muted">Nothing to show</p>;
}

function TimelineRow({
  list,
  onToggle,
}: {
  list: TimelineList;
  onToggle: (list: TimelineList) => void;
}) {
  const label = `${list.pinned ? "Unpin" : "Pin"} ${list.name}`;

  return (
    <div className="flex h-[72px] items-center gap-4 px-4">
      <ListThumbnail listId={list.id} bannerUrl={list.bannerUrl} />
      <span className="flex min-w-0 grow flex-col">
        <span className="flex min-w-0 items-center">
          <span className="truncate text-base font-bold">{list.name}</span>
          {list.private ? (
            <LockIcon
              role="img"
              aria-hidden={false}
              aria-label="Private List"
              className="ml-0.5 size-[18.75px] shrink-0"
            />
          ) : null}
        </span>
        <span className="truncate text-xs text-muted">@{list.ownerHandle}</span>
      </span>
      <Tooltip label={list.pinned ? "Unpin" : "Pin"}>
        <button
          type="button"
          aria-label={label}
          onClick={() => onToggle(list)}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full transition-colors duration-200 ease-[ease]",
            list.pinned
              ? "text-danger hover:bg-danger/10"
              : "text-repost hover:bg-repost/10",
          )}
        >
          {list.pinned ? (
            <PinMinusIcon className="size-6" />
          ) : (
            <PinPlusIcon className="size-6" />
          )}
        </button>
      </Tooltip>
    </div>
  );
}

function CollapsibleSection({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section>
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={`${expanded ? "Collapse" : "Expand"} ${title}`}
        onClick={onToggle}
        className={cn(sectionHeading, "transition-colors duration-200 ease-[ease] hover:bg-white/3")}
      >
        {title}
        {expanded ? (
          <ChevronDownIcon className="size-5 text-muted" />
        ) : (
          <ChevronRightIcon className="size-5 text-muted" />
        )}
      </button>
      {expanded ? children : null}
    </section>
  );
}

export function ManageTimelinesModal({ lists, onClose }: ManageTimelinesModalProps) {
  const titleId = useId();
  const [query, setQuery] = useState("");
  const [listsExpanded, setListsExpanded] = useState(true);
  const [communitiesExpanded, setCommunitiesExpanded] = useState(false);
  const [optimisticLists, togglePinned] = useOptimistic(
    lists,
    (current, listId: string) =>
      current.map((list) =>
        list.id === listId ? { ...list, pinned: !list.pinned } : list,
      ),
  );

  function toggle(list: TimelineList) {
    startTransition(async () => {
      togglePinned(list.id);
      await toggleTimelinePin(list.id);
    });
  }

  const term = query.trim().toLowerCase();
  const matching = optimisticLists.filter((list) =>
    list.name.toLowerCase().includes(term),
  );
  const pinned = matching.filter((list) => list.pinned);
  const unpinned = matching.filter((list) => !list.pinned);

  return (
    <Modal
      onClose={onClose}
      labelledBy={titleId}
      restoreFocusOnUnmount
      className="max-h-[min(720px,90vh)] overflow-y-auto"
    >
      <ModalHeader
        title="Timelines"
        titleId={titleId}
        align="center"
        action={
          <IconButton label="Close" tone="plain" onClick={onClose} className="-mr-2 size-9">
            <CloseIcon className="size-5" />
          </IconButton>
        }
        className="h-11"
      />
      <div className="sticky top-11 z-1 bg-background px-4 pb-2">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search timelines"
          placeholder="Search"
          className="h-11 w-full rounded-xl bg-[#202327] px-4 text-base outline-none placeholder:text-muted focus:shadow-[inset_0_0_0_1px_var(--color-accent)] [&::-webkit-search-cancel-button]:hidden"
        />
      </div>
      <section className="pt-2">
        <h3 className={sectionHeading}>Pinned</h3>
        {pinned.length ? (
          pinned.map((list) => (
            <TimelineRow key={list.id} list={list} onToggle={toggle} />
          ))
        ) : (
          <NothingToShow />
        )}
      </section>
      <CollapsibleSection
        title="Lists"
        expanded={listsExpanded}
        onToggle={() => setListsExpanded((current) => !current)}
      >
        {unpinned.length ? (
          unpinned.map((list) => (
            <TimelineRow key={list.id} list={list} onToggle={toggle} />
          ))
        ) : (
          <NothingToShow />
        )}
      </CollapsibleSection>
      <CollapsibleSection
        title="Communities"
        expanded={communitiesExpanded}
        onToggle={() => setCommunitiesExpanded((current) => !current)}
      >
        <NothingToShow />
      </CollapsibleSection>
    </Modal>
  );
}
