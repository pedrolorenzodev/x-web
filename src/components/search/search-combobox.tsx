"use client";

import { useRouter } from "next/navigation";
import {
  Fragment,
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import type { RecentSearch, TypeaheadResult } from "@/types/search";
import { routes } from "@/config/routes";
import { ClearCircleFillIcon, ExploreIcon } from "@/components/ui/icons";
import { useSearchServices } from "@/components/search/search-services-context";
import {
  TypeaheadOption,
  type TypeaheadOptionData,
} from "@/components/search/typeahead-option";
import { cn } from "@/lib/utils";
import { searchHref, type SearchSource } from "@/utils/search-href";

const DEBOUNCE_MS = 150;

type SearchComboboxProps = {
  defaultValue?: string;
  autoFocus?: boolean;
  className?: string;
};

function recentOptions(recent: RecentSearch[]): TypeaheadOptionData[] {
  return recent.map((item) =>
    item.kind === "query"
      ? { kind: "query", query: item.query, recentId: item.id }
      : { kind: "user", user: item.user, recentId: item.id },
  );
}

function typeaheadOptions(
  query: string,
  typeahead: TypeaheadResult | null,
): TypeaheadOptionData[] {
  const typed = query.toLowerCase();
  const handle = typed.replace(/^@/, "");
  const suggestions = (typeahead?.suggestions ?? []).filter(
    (suggestion) => suggestion !== typed && suggestion.startsWith(typed),
  );
  const exactHandle =
    typeahead?.exactHandle?.toLowerCase() === handle
      ? typeahead.exactHandle
      : null;

  return [
    { kind: "query", query },
    ...suggestions.map((suggestion) => ({
      kind: "query" as const,
      query: suggestion,
    })),
    ...(typeahead?.users ?? []).map((user) => ({ kind: "user" as const, user })),
    ...(exactHandle ? [{ kind: "goto" as const, handle: exactHandle }] : []),
  ];
}

export function SearchCombobox({
  defaultValue = "",
  autoFocus = false,
  className,
}: SearchComboboxProps) {
  const services = useSearchServices();
  const router = useRouter();
  const baseId = useId();
  const listboxId = `${baseId}listbox`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState<RecentSearch[] | null>(null);
  const [typeahead, setTypeahead] = useState<TypeaheadResult | null>(null);

  const query = value.trim();
  const options = query
    ? typeaheadOptions(query, typeahead)
    : recentOptions(recent ?? []);
  const activeOption = open ? options[activeIndex] : undefined;
  const optionId = (index: number) => `${baseId}option-${index}`;

  const loadTypeahead = useEffectEvent(async (typed: string) => {
    const result = await services?.getTypeahead(typed);
    if (!result || result.query !== inputRef.current?.value.trim()) return;
    setTypeahead(result);
    setActiveIndex(-1);
  });

  useEffect(() => {
    if (!query) return;
    const timeout = window.setTimeout(() => loadTypeahead(query), DEBOUNCE_MS);
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`${baseId}option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, baseId]);

  async function loadRecent() {
    const items = await services?.getRecentSearches();
    if (items) setRecent(items);
  }

  function openDropdown() {
    setOpen(true);
    void loadRecent();
  }

  function closeDropdown() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function leave() {
    closeDropdown();
    inputRef.current?.blur();
  }

  function search(text: string, src: SearchSource = "typed_query") {
    const trimmed = text.trim();
    if (!trimmed) return;
    setValue(trimmed);
    void services?.saveRecentQuery(trimmed);
    leave();
    router.push(searchHref(trimmed, src));
  }

  function goToProfile(handle: string) {
    void services?.saveRecentUser(handle);
    leave();
    router.push(routes.profile(handle));
  }

  function select(option: TypeaheadOptionData) {
    if (option.kind === "query") {
      const src: SearchSource = option.recentId
        ? "recent_search_click"
        : option.query === value.trim()
          ? "typed_query"
          : "typeahead_click";
      search(option.query, src);
    }
    else goToProfile(option.kind === "user" ? option.user.handle : option.handle);
  }

  function removeRecent(id: string) {
    setRecent((items) => items?.filter((item) => item.id !== id) ?? items);
    setActiveIndex(-1);
    void services?.removeRecentSearch(id);
  }

  function clearRecent() {
    setRecent([]);
    setActiveIndex(-1);
    void services?.clearRecentSearches();
  }

  function clearValue() {
    setValue("");
    setTypeahead(null);
    setActiveIndex(-1);
    inputRef.current?.focus();
    openDropdown();
  }

  function moveActive(step: 1 | -1) {
    if (!options.length) return;
    setActiveIndex((current) =>
      current === -1
        ? step === 1
          ? 0
          : options.length - 1
        : (current + step + options.length) % options.length,
    );
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (open) moveActive(event.key === "ArrowDown" ? 1 : -1);
      else openDropdown();
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (activeOption) select(activeOption);
      else search(value);
    } else if (event.key === "Escape" && open) {
      event.preventDefault();
      closeDropdown();
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    search(value);
  }

  function onBlur(event: FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) closeDropdown();
  }

  const showRecentHeader = !query && Boolean(recent?.length);
  const showEmptyCopy = !query && recent?.length === 0;
  const firstUserIndex = options.findIndex((option) => option.kind === "user");

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      onBlur={onBlur}
      className={cn("relative w-full", className)}
    >
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex h-11 w-full cursor-text items-center rounded-full border border-border-strong bg-background transition-[border-color,background-color,box-shadow] duration-150 ease-[cubic-bezier(0.2,0,0,1)] focus-within:border-accent focus-within:shadow-[inset_0_0_0_1px_var(--color-accent),0_0_0_1px_var(--color-accent)]"
      >
        <span className="flex w-7 shrink-0 pl-3">
          <ExploreIcon className="size-4 text-muted" />
        </span>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          value={value}
          autoFocus={autoFocus}
          placeholder="Search"
          aria-label="Search query"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={
            activeOption ? optionId(activeIndex) : undefined
          }
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="search"
          onFocus={openDropdown}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          onKeyDown={onKeyDown}
          className="h-10 min-w-0 flex-1 bg-transparent pr-4 pl-1 text-sm text-foreground outline-none placeholder:text-muted"
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear"
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.stopPropagation();
              clearValue();
            }}
            className="mr-[13px] flex size-[22px] shrink-0 items-center justify-center rounded-full"
          >
            <ClearCircleFillIcon className="size-[22px] text-inverted" />
          </button>
        ) : null}
      </div>
      {open ? (
        <div
          onMouseDown={(event) => event.preventDefault()}
          className="absolute top-full left-0 z-10 max-h-[calc(80vh-53px)] min-h-[100px] w-full overflow-y-auto overscroll-contain rounded-lg bg-background shadow-[0_0_15px_rgb(255_255_255/0.2),0_0_3px_1px_rgb(255_255_255/0.15)]"
        >
          {showEmptyCopy ? (
            <p className="px-4 pt-5 text-center text-base text-muted">
              Try searching for people, lists, or keywords
            </p>
          ) : null}
          {showRecentHeader ? (
            <div className="flex h-12 items-center justify-between px-4">
              <h2 className="text-xl font-bold">Recent</h2>
              <button
                type="button"
                onClick={clearRecent}
                className="h-6 rounded-full px-3 text-sm font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
              >
                Clear all
              </button>
            </div>
          ) : null}
          <div role="listbox" id={listboxId} aria-label="Search suggestions">
            {options.map((option, index) => (
              <Fragment key={`${option.kind}-${index}`}>
                {query && index === firstUserIndex && index > 0 ? (
                  <div aria-hidden className="my-1 h-px bg-border" />
                ) : null}
                <TypeaheadOption
                  id={optionId(index)}
                  option={option}
                  active={index === activeIndex}
                  prefix={query}
                  onSelect={() => select(option)}
                  onRemove={removeRecent}
                />
              </Fragment>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
