"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import type { Gif } from "@/types/gif";
import { BackIcon, CloseIcon } from "@/components/ui/icons";
import { IconButton } from "@/components/ui/icon-button";
import { Modal } from "@/components/ui/modal";
import { PillSearchInput } from "@/components/ui/pill-search-input";
import { SpinnerRow } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { searchGifs } from "@/features/compose/api/search-gifs";

const SEARCH_DEBOUNCE = 300;
const TARGET_ROW_HEIGHT = 135;
const GAP = 2;
const AUTOPLAY_KEY = "x-web:gif-autoplay";

type GifRow = {
  height: number;
  gifs: Gif[];
};

function buildRows(gifs: Gif[], width: number): GifRow[] {
  const rows: GifRow[] = [];
  let current: Gif[] = [];
  let aspectSum = 0;

  for (const gif of gifs) {
    current.push(gif);
    aspectSum += gif.aspectRatio;
    const gaps = (current.length - 1) * GAP;
    if (aspectSum * TARGET_ROW_HEIGHT + gaps >= width) {
      rows.push({ height: (width - gaps) / aspectSum, gifs: current });
      current = [];
      aspectSum = 0;
    }
  }
  if (current.length > 0) rows.push({ height: TARGET_ROW_HEIGHT, gifs: current });
  return rows;
}

function readAutoplay() {
  try {
    return window.localStorage.getItem(AUTOPLAY_KEY) !== "off";
  } catch {
    return true;
  }
}

type GifPickerModalProps = {
  onSelect: (gif: Gif) => void;
  onClose: () => void;
};

export function GifPickerModal({ onSelect, onClose }: GifPickerModalProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [gifs, setGifs] = useState<Gif[] | null>(null);
  const [width, setWidth] = useState(0);
  const [autoplay, setAutoplay] = useState(readAutoplay);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const term = query;
    const timeout = window.setTimeout(
      () => {
        startTransition(async () => {
          const results = await searchGifs(term);
          setGifs(results);
        });
      },
      term ? SEARCH_DEBOUNCE : 0,
    );
    return () => window.clearTimeout(timeout);
  }, [query]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const observer = new ResizeObserver(([entry]) =>
      setWidth(entry.contentRect.width),
    );
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  function toggleAutoplay(next: boolean) {
    setAutoplay(next);
    try {
      window.localStorage.setItem(AUTOPLAY_KEY, next ? "on" : "off");
    } catch {
      return;
    }
  }

  const rows = gifs && width > 0 ? buildRows(gifs, width) : [];

  return (
    <Modal
      label="Choose a GIF"
      placement="top"
      size="fixed"
      onClose={onClose}
      restoreFocusOnUnmount
      focusOnOpen={() => headerRef.current?.querySelector("input")?.focus()}
      className="bg-elevated"
    >
      <div ref={headerRef} className="flex h-[53px] shrink-0 items-center gap-4 px-4">
        <IconButton
          label={query ? "Back" : "Close"}
          tone="plain"
          onClick={query ? () => setQuery("") : onClose}
          className="-ml-2 size-9 shrink-0"
        >
          {query ? (
            <BackIcon className="size-5" />
          ) : (
            <CloseIcon className="size-5" />
          )}
        </IconButton>
        <PillSearchInput
          value={query}
          label="Search for GIFs"
          placeholder="Search for GIFs"
          onValueChange={setQuery}
          className="h-10 flex-1"
        />
      </div>

      <div className="flex h-11 shrink-0 items-center justify-between px-3">
        <span className="text-base">Auto-play GIFs</span>
        <Switch
          size="sm"
          label="Auto-play GIFs"
          checked={autoplay}
          onChange={toggleAutoplay}
        />
      </div>

      <div ref={gridRef} className="min-h-0 flex-1 overflow-y-auto">
        {gifs === null ? (
          <SpinnerRow label="Loading GIFs" />
        ) : gifs.length === 0 ? (
          <div className="px-8 py-10 text-center">
            <p className="text-xl font-bold">No GIFs found</p>
            <p className="mt-1 text-base text-muted">
              Try searching for something else instead.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex gap-0.5"
                style={{ height: row.height }}
              >
                {row.gifs.map((gif) => (
                  <button
                    key={gif.id}
                    type="button"
                    onClick={() => onSelect(gif)}
                    style={{ width: row.height * gif.aspectRatio }}
                    className="relative shrink-0 overflow-hidden bg-border outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-accent)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={autoplay ? gif.previewUrl : gif.stillUrl}
                      alt={gif.alt}
                      loading="lazy"
                      className="size-full object-cover"
                    />
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
