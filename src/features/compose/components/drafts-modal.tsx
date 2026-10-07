"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Draft, DraftsTab } from "@/types/draft";
import { routes } from "@/config/routes";
import { Checkbox } from "@/components/ui/checkbox";
import { ConfirmSheet } from "@/components/ui/confirm-sheet";
import { EmptyState } from "@/components/ui/empty-state";
import { ScheduleIcon } from "@/components/ui/icons";
import { Modal, ModalHeader } from "@/components/ui/modal";
import { Tab } from "@/components/ui/tab";
import { TabBar } from "@/components/ui/tab-bar";
import {
  useRouteModalClose,
  type RouteModalDismiss,
} from "@/hooks/use-route-modal-close";
import { deleteDrafts } from "@/features/compose/api/delete-drafts";
import { formatScheduleDate } from "@/features/compose/utils/format-schedule";
import { cn } from "@/lib/utils";

const tabs: { id: DraftsTab; label: string; href: string }[] = [
  { id: "drafts", label: "Unsent posts", href: routes.composeDrafts },
  { id: "scheduled", label: "Scheduled", href: routes.composeScheduled },
];

const textButton =
  "flex h-8 items-center rounded-full px-3 text-sm font-bold transition-colors duration-200 ease-[ease] disabled:opacity-50";

type DraftsModalProps = {
  tab: DraftsTab;
  drafts: Draft[];
  dismiss: RouteModalDismiss;
};

export function DraftsModal({ tab, drafts, dismiss }: DraftsModalProps) {
  const router = useRouter();
  const close = useRouteModalClose(dismiss);
  const [editing, setEditing] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirming, setConfirming] = useState(false);
  const [deleting, startDeleting] = useTransition();
  const allSelected = drafts.length > 0 && selected.size === drafts.length;

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function stopEditing() {
    setEditing(false);
    setSelected(new Set());
  }

  function discardSelected() {
    startDeleting(async () => {
      await deleteDrafts([...selected]);
      setConfirming(false);
      stopEditing();
    });
  }

  return (
    <Modal
      label="Drafts"
      placement="top"
      size="fixed"
      onClose={close}
      className="bg-elevated"
    >
      <ModalHeader
        onBack={close}
        title="Drafts"
        className="bg-elevated/85"
        action={
          drafts.length > 0 ? (
            <button
              type="button"
              onClick={editing ? stopEditing : () => setEditing(true)}
              className={cn(textButton, "text-accent hover:bg-accent/10")}
            >
              {editing ? "Done" : "Edit"}
            </button>
          ) : null
        }
      />
      <TabBar label="Drafts">
        {tabs.map((item) => (
          <Tab
            key={item.id}
            label={item.label}
            active={item.id === tab}
            onClick={() => router.replace(item.href)}
          />
        ))}
      </TabBar>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {drafts.length === 0 ? (
          <EmptyState
            title="Hold that thought"
            body="Not ready to post just yet? Save it to your drafts or schedule it for later."
          />
        ) : (
          <ul>
            {drafts.map((draft) => (
              <DraftRow
                key={draft.id}
                draft={draft}
                editing={editing}
                checked={selected.has(draft.id)}
                onToggle={() => toggle(draft.id)}
                onOpen={() => router.replace(routes.composeDraft(draft.id))}
              />
            ))}
          </ul>
        )}
      </div>

      {editing ? (
        <div className="flex h-[53px] shrink-0 items-center justify-between border-t border-border px-4">
          <button
            type="button"
            onClick={() =>
              setSelected(
                allSelected ? new Set() : new Set(drafts.map((item) => item.id)),
              )
            }
            className={cn(textButton, "text-accent hover:bg-accent/10")}
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
          <button
            type="button"
            disabled={selected.size === 0}
            onClick={() => setConfirming(true)}
            className={cn(textButton, "text-danger hover:bg-danger/10")}
          >
            Delete
          </button>
        </div>
      ) : null}

      {confirming ? (
        <ConfirmSheet
          title={tab === "scheduled" ? "Cancel scheduled posts?" : "Discard unsent posts?"}
          body="This can’t be undone and you’ll lose your drafts."
          confirmLabel="Discard"
          tone="danger"
          pending={deleting}
          onConfirm={discardSelected}
          onCancel={() => setConfirming(false)}
        />
      ) : null}
    </Modal>
  );
}

type DraftRowProps = {
  draft: Draft;
  editing: boolean;
  checked: boolean;
  onToggle: () => void;
  onOpen: () => void;
};

function DraftRow({ draft, editing, checked, onToggle, onOpen }: DraftRowProps) {
  const [first] = draft.posts;
  const thumbnail = first?.media[0];
  const extraPosts = draft.posts.length - 1;

  const content = (
    <>
      <div className="min-w-0 flex-1">
        {draft.scheduledAt ? (
          <p className="mb-1 flex items-center gap-1.5 text-xs text-muted">
            <ScheduleIcon className="size-4" />
            <span suppressHydrationWarning>
              Will send on {formatScheduleDate(draft.scheduledAt)}
            </span>
          </p>
        ) : null}
        <p className="line-clamp-3 text-base break-words whitespace-pre-wrap">
          {first?.text || (first?.poll ? "Poll" : "")}
        </p>
        {extraPosts > 0 ? (
          <p className="mt-1 text-sm text-muted">
            +{extraPosts} {extraPosts === 1 ? "post" : "posts"}
          </p>
        ) : null}
      </div>
      {thumbnail ? (
        <span className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border">
          <Image
            src={thumbnail.url}
            alt={thumbnail.alt}
            fill
            sizes="64px"
            className="object-cover"
          />
        </span>
      ) : null}
    </>
  );

  const rowClass =
    "flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors duration-200 ease-[ease] hover:bg-white/3";

  if (editing) {
    return (
      <li>
        <label className={cn(rowClass, "cursor-pointer")}>
          <Checkbox
            checked={checked}
            onChange={onToggle}
            aria-label="Select draft"
            className="-ml-2"
          />
          {content}
        </label>
      </li>
    );
  }

  return (
    <li>
      <button type="button" onClick={onOpen} className={rowClass}>
        {content}
      </button>
    </li>
  );
}
