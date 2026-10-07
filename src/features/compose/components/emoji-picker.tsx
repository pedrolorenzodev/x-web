"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { PillSearchInput } from "@/components/ui/pill-search-input";
import { CheckIcon, ClockIcon, PopoverArrowIcon } from "@/components/ui/icons";
import { useEscapeToClose } from "@/hooks/use-escape-to-close";
import {
  placeBelowCentered,
  type FloatingPosition,
} from "@/utils/floating-position";
import {
  applySkinTone,
  emojiCategories,
  findEmoji,
  searchEmojis,
  skinTones,
  type Emoji,
} from "@/features/compose/utils/emojis";
import { cn } from "@/lib/utils";

const PANEL = { width: 320, height: 400 };
const GAP = 12;
const RECENT_KEY = "x-web:emoji-recent";
const TONE_KEY = "x-web:emoji-tone";
const MAX_RECENT = 27;
const RECENT_ID = "recent";
const PREVIEW_EMOJI = "👋";

type EmojiPickerProps = {
  anchorRef: RefObject<HTMLElement | null>;
  onSelect: (emoji: string) => void;
  onClose: () => void;
};

type Section = {
  id: string;
  label: string;
  emojis: Emoji[];
};

function readStorage(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function readRecent() {
  return (readStorage(RECENT_KEY) ?? "")
    .split(" ")
    .map(findEmoji)
    .filter((emoji): emoji is Emoji => Boolean(emoji));
}

function readTone() {
  const index = Number(readStorage(TONE_KEY));
  return Number.isInteger(index) && skinTones[index] ? index : 0;
}

export function EmojiPicker({ anchorRef, onSelect, onClose }: EmojiPickerProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<FloatingPosition | null>(null);
  const [arrowLeft, setArrowLeft] = useState(0);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(readRecent);
  const [tone, setTone] = useState(readTone);
  const [toneOpen, setToneOpen] = useState(false);
  const [preview, setPreview] = useState<Emoji | null>(null);
  const [activeSection, setActiveSection] = useState<string>(
    emojiCategories[0].id,
  );

  useEscapeToClose(true, onClose, { capture: true });

  useLayoutEffect(() => {
    function place() {
      const anchor = anchorRef.current?.getBoundingClientRect();
      if (!anchor) return;
      const next = placeBelowCentered(anchor, PANEL, GAP);
      setPosition(next);
      setArrowLeft(anchor.left + anchor.width / 2 - next.left);
    }
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [anchorRef]);

  const searching = query.trim() !== "";
  const sections: Section[] = searching
    ? [{ id: "search", label: "Search results", emojis: searchEmojis(query) }]
    : [
        ...(recent.length > 0
          ? [{ id: RECENT_ID, label: "Recent", emojis: recent }]
          : []),
        ...emojiCategories,
      ];

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || searching) return;
    function onScroll() {
      if (!grid) return;
      const headings = grid.querySelectorAll<HTMLElement>("[data-section]");
      let current = headings[0]?.dataset.section;
      headings.forEach((heading) => {
        if (heading.offsetTop - grid.offsetTop <= grid.scrollTop + 1) {
          current = heading.dataset.section;
        }
      });
      if (current) setActiveSection(current);
    }
    grid.addEventListener("scroll", onScroll, { passive: true });
    return () => grid.removeEventListener("scroll", onScroll);
  }, [searching]);

  function jumpTo(sectionId: string) {
    setQuery("");
    setActiveSection(sectionId);
    requestAnimationFrame(() => {
      const grid = gridRef.current;
      const heading = grid?.querySelector<HTMLElement>(
        `[data-section="${sectionId}"]`,
      );
      if (grid && heading) grid.scrollTop = heading.offsetTop - grid.offsetTop;
    });
  }

  function select(emoji: Emoji) {
    onSelect(applySkinTone(emoji, skinTones[tone].modifier));
    const next = [emoji, ...recent.filter((item) => item.char !== emoji.char)];
    const trimmed = next.slice(0, MAX_RECENT);
    setRecent(trimmed);
    writeStorage(RECENT_KEY, trimmed.map((item) => item.char).join(" "));
  }

  function chooseTone(index: number) {
    setTone(index);
    setToneOpen(false);
    writeStorage(TONE_KEY, String(index));
  }

  const previewEmoji = preview ?? findEmoji(PREVIEW_EMOJI);

  return createPortal(
    <>
      <div aria-hidden onClick={onClose} className="fixed inset-0 z-50" />
      <div
        role="dialog"
        aria-label="Emoji picker"
        style={
          position
            ? { top: position.top, left: position.left }
            : { top: 0, left: 0, visibility: "hidden" }
        }
        className="t-tooltip fixed z-50 flex h-[400px] w-[320px] origin-top flex-col rounded-2xl bg-background shadow-[0_0_15px_rgb(255_255_255/0.2),0_0_3px_1px_rgb(255_255_255/0.15)]"
      >
        <PopoverArrowIcon
          style={{ left: arrowLeft - 12 }}
          className={cn(
            "absolute h-[16.25px] w-6 text-background drop-shadow-[0_-1px_1px_rgb(255_255_255/0.15)]",
            position?.side === "top"
              ? "-bottom-[11px] rotate-180"
              : "-top-[11px]",
          )}
        />
        <div className="px-1 pt-1">
          <PillSearchInput
            value={query}
            label="Search emojis"
            placeholder="Search emojis"
            autoFocus
            onValueChange={setQuery}
          />
        </div>

        <div
          role="tablist"
          aria-label="Emoji categories"
          className="flex border-b border-border px-1"
        >
          <CategoryTab
            label="Recent"
            selected={!searching && activeSection === RECENT_ID}
            disabled={recent.length === 0}
            onClick={() => jumpTo(RECENT_ID)}
          >
            <ClockIcon className="size-5" />
          </CategoryTab>
          {emojiCategories.map((category) => (
            <CategoryTab
              key={category.id}
              label={category.label}
              selected={!searching && activeSection === category.id}
              onClick={() => jumpTo(category.id)}
            >
              <span className="text-lg leading-none">{category.icon}</span>
            </CategoryTab>
          ))}
        </div>

        <div
          ref={gridRef}
          role="listbox"
          aria-label="Emojis"
          className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-2"
        >
          {sections.map((section) => (
            <div key={section.id} className="[content-visibility:auto]">
              <h3
                data-section={section.id}
                className="sticky top-0 z-1 bg-background/95 px-1 pt-3 pb-2 text-lg font-bold"
              >
                {section.label}
              </h3>
              {section.emojis.length > 0 ? (
                <div className="grid grid-cols-9">
                  {section.emojis.map((emoji) => (
                    <button
                      key={emoji.char}
                      type="button"
                      role="option"
                      aria-selected={false}
                      aria-label={emoji.name}
                      onPointerEnter={() => setPreview(emoji)}
                      onFocus={() => setPreview(emoji)}
                      onClick={() => select(emoji)}
                      className="flex h-8 items-center justify-center rounded-full text-[22px] leading-none transition-colors duration-200 ease-[ease] hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-none"
                    >
                      {applySkinTone(emoji, skinTones[tone].modifier)}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-1 py-6 text-center">
                  <p className="text-lg font-bold">No Emojis found</p>
                  <p className="mt-1 text-base text-muted">
                    Try searching for something else instead.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex h-14 shrink-0 items-center gap-3 border-t border-border px-4">
          <span aria-hidden className="text-[28px] leading-none">
            {previewEmoji
              ? applySkinTone(previewEmoji, skinTones[tone].modifier)
              : null}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-bold">
            {preview?.name}
          </span>
          <div
            role="radiogroup"
            aria-label="Skin tone"
            className="flex items-center gap-1"
          >
            {skinTones.map((option, index) =>
              toneOpen || index === tone ? (
                <button
                  key={option.label}
                  type="button"
                  role="radio"
                  aria-checked={index === tone}
                  aria-label={option.label}
                  onClick={() =>
                    toneOpen ? chooseTone(index) : setToneOpen(true)
                  }
                  style={{ backgroundColor: option.swatch }}
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full",
                    index === tone &&
                      "shadow-[0_0_0_2px_var(--color-background),0_0_0_4px_var(--color-accent)]",
                  )}
                >
                  {index === tone ? (
                    <CheckIcon className="size-3.5 text-white drop-shadow-[0_0_1px_rgb(0_0_0/0.6)]" />
                  ) : null}
                </button>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

type CategoryTabProps = {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
};

function CategoryTab({
  label,
  selected,
  disabled = false,
  onClick,
  children,
}: CategoryTabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-label={label}
      aria-selected={selected}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "relative flex h-10 flex-1 items-center justify-center text-muted transition-[filter,opacity] duration-200 ease-[ease] hover:bg-accent/10 disabled:pointer-events-none disabled:opacity-50",
        selected ? "text-accent" : "grayscale",
      )}
    >
      {children}
      {selected ? (
        <span className="absolute inset-x-1 bottom-0 h-1 rounded-full bg-accent" />
      ) : null}
    </button>
  );
}
