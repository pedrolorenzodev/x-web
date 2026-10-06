"use client";

import type { MouseEvent } from "react";
import type { UserSummary } from "@/types/user";
import { Avatar } from "@/components/ui/avatar";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { UserBadges } from "@/components/ui/verified-badge";
import { cn } from "@/lib/utils";

export type TypeaheadOptionData =
  | { kind: "query"; query: string; recentId?: string }
  | { kind: "user"; user: UserSummary; recentId?: string }
  | { kind: "goto"; handle: string };

type TypeaheadOptionProps = {
  id: string;
  option: TypeaheadOptionData;
  active: boolean;
  prefix: string;
  onSelect: () => void;
  onRemove: (recentId: string) => void;
};

function QueryLabel({ query, prefix }: { query: string; prefix: string }) {
  const typed = prefix.toLowerCase();
  if (!typed || !query.toLowerCase().startsWith(typed)) {
    return <span className="truncate">{query}</span>;
  }

  return (
    <span className="truncate whitespace-pre">
      {query.slice(0, typed.length)}
      <span className="font-bold">{query.slice(typed.length)}</span>
    </span>
  );
}

function RemoveButton({
  recentId,
  onRemove,
}: {
  recentId: string;
  onRemove: (recentId: string) => void;
}) {
  function remove(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onRemove(recentId);
  }

  return (
    <button
      type="button"
      tabIndex={-1}
      aria-label="Remove"
      onClick={remove}
      className="relative ml-auto flex size-8 shrink-0 items-center justify-center rounded-full text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
    >
      <CloseIcon className="size-[18px]" />
    </button>
  );
}

export function TypeaheadOption({
  id,
  option,
  active,
  prefix,
  onSelect,
  onRemove,
}: TypeaheadOptionProps) {
  const row = cn(
    "flex w-full cursor-pointer items-center px-4 text-base transition-colors duration-200 ease-[ease] hover:bg-menu-hover",
    active && "bg-menu-hover",
  );
  const recentId = option.kind === "goto" ? undefined : option.recentId;
  const label =
    option.kind === "query" && !recentId
      ? `Search for "${option.query}"`
      : undefined;

  return (
    <div
      id={id}
      role="option"
      aria-selected={active}
      aria-label={label}
      onClick={onSelect}
      className={cn(
        row,
        option.kind === "query" && "h-16",
        option.kind === "user" && "py-3",
        option.kind === "goto" && "h-13",
      )}
    >
      {option.kind === "query" ? (
        <>
          <span className="flex w-10 shrink-0 justify-center">
            <SearchIcon className="size-5" />
          </span>
          <span className="ml-2 flex min-w-0 grow pr-2">
            <QueryLabel query={option.query} prefix={recentId ? "" : prefix} />
          </span>
        </>
      ) : null}
      {option.kind === "user" ? (
        <>
          <Avatar src={option.user.avatarUrl} alt="" />
          <span className="ml-2 flex min-w-0 grow flex-col pr-2">
            <span className="flex min-w-0 items-center">
              <span className="truncate font-bold">
                {option.user.displayName}
              </span>
              <UserBadges user={option.user} />
            </span>
            <span className="truncate text-muted">@{option.user.handle}</span>
          </span>
        </>
      ) : null}
      {option.kind === "goto" ? (
        <span className="truncate">Go to @{option.handle}</span>
      ) : null}
      {recentId ? <RemoveButton recentId={recentId} onRemove={onRemove} /> : null}
    </div>
  );
}
