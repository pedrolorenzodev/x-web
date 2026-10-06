"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ClearCircleFillIcon, SearchIcon } from "@/components/ui/icons";
import { SpinnerRow } from "@/components/ui/spinner";
import { Tab } from "@/components/ui/tab";
import { UserCell } from "@/components/user/user-cell";
import { useUserCardServices } from "@/components/user/user-card-context";
import { getListCandidates } from "@/features/lists/api/get-list-candidates";

type MemberPickerProps = {
  suggestions: User[];
  members: User[];
  onChange: (members: User[]) => void;
};

const SEARCH_DELAY_MS = 250;
const noFollow = async () => {};

export function MemberPicker({ suggestions, members, onChange }: MemberPickerProps) {
  const services = useUserCardServices();
  const [tab, setTab] = useState<"members" | "suggested">("suggested");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[] | null>(null);
  const [searching, startSearch] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const memberIds = new Set(members.map((member) => member.id));

  useEffect(() => {
    if (!query.trim()) return;
    let stale = false;
    const timeout = window.setTimeout(() => {
      startSearch(async () => {
        const users = await getListCandidates(query);
        if (!stale) startSearch(() => setResults(users));
      });
    }, SEARCH_DELAY_MS);
    return () => {
      stale = true;
      window.clearTimeout(timeout);
    };
  }, [query]);

  function toggle(user: User) {
    onChange(
      memberIds.has(user.id)
        ? members.filter((member) => member.id !== user.id)
        : [...members, user],
    );
  }

  function renderUser(user: User) {
    const added = memberIds.has(user.id);
    return (
      <UserCell
        key={user.id}
        user={user}
        viewerId={services?.viewerId ?? ""}
        toggleFollow={services?.toggleFollow ?? noFollow}
        action={
          <Button
            size="sm"
            variant={added ? "outline" : "primary"}
            aria-label={`${added ? "Remove" : "Add"} @${user.handle}`}
            onClick={() => toggle(user)}
            className="relative shrink-0"
          >
            {added ? "Remove" : "Add"}
          </Button>
        }
      />
    );
  }

  const visible = query.trim() ? (results ?? []) : suggestions;

  return (
    <>
      <div role="tablist" className="flex border-b border-border">
        <Tab
          label={`Members (${members.length})`}
          active={tab === "members"}
          onClick={() => setTab("members")}
        />
        <Tab
          label="Suggested"
          active={tab === "suggested"}
          onClick={() => setTab("suggested")}
        />
      </div>
      {tab === "members" ? (
        members.length ? (
          members.map(renderUser)
        ) : (
          <EmptyState
            title="This List is lonely"
            body="People added to this List will show up here."
            className="max-w-[336px] px-0"
          />
        )
      ) : (
        <>
          <div className="px-4 pt-2 pb-1">
            <label className="flex h-11 cursor-text items-center rounded-full border border-border-strong transition-[border-color,box-shadow] duration-150 focus-within:border-accent focus-within:shadow-[0_0_0_1px_var(--color-accent)]">
              <span className="flex w-7 shrink-0 pl-3">
                <SearchIcon className="size-4 text-muted" />
              </span>
              <input
                ref={inputRef}
                value={query}
                autoFocus
                aria-label="Search people"
                placeholder="Search people"
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (!event.target.value.trim()) setResults(null);
                }}
                className="h-10 min-w-0 flex-1 bg-transparent pr-4 pl-1 text-sm outline-none placeholder:text-muted"
              />
              {query ? (
                <button
                  type="button"
                  aria-label="Clear"
                  onClick={() => {
                    setQuery("");
                    setResults(null);
                    inputRef.current?.focus();
                  }}
                  className="mr-[13px] flex size-[22px] shrink-0 items-center justify-center rounded-full"
                >
                  <ClearCircleFillIcon className="size-[22px] text-inverted" />
                </button>
              ) : null}
            </label>
          </div>
          {query.trim() && (searching || results === null) ? (
            <SpinnerRow />
          ) : query.trim() && visible.length === 0 ? (
            <p className="px-8 py-8 text-center text-base text-muted">
              No results for “{query.trim()}”
            </p>
          ) : (
            <>
              {query.trim() ? null : (
                <h3 className="px-4 pt-3 pb-1 text-xl font-extrabold">
                  List suggestions
                </h3>
              )}
              {visible.map(renderUser)}
            </>
          )}
        </>
      )}
    </>
  );
}
