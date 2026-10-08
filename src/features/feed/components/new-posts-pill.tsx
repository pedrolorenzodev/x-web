"use client";

import { useEffect, useEffectEvent, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ArrowUpIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { NewPostsPreview } from "@/features/feed/types/new-posts";
import type { TimelineKind } from "@/features/feed/types/timeline-kind";
import { checkNewPosts } from "@/features/feed/api/check-new-posts";
import { showNewPosts } from "@/features/feed/api/show-new-posts";
import { useTimelineTabs } from "@/features/feed/components/timeline-tabs-provider";

const NEW_POSTS_DELAY_MS = 30_000;
const LOAD_NEW_POSTS_KEY = ".";

function isAtTop() {
  return window.scrollY <= 0;
}

function isTypingTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

export function NewPostsPill({ kind }: { kind: TimelineKind }) {
  const { pending, select } = useTimelineTabs();
  const [preview, setPreview] = useState<NewPostsPreview | null>(null);

  function reveal(smooth: boolean) {
    setPreview(null);
    select(kind, kind, { smooth, prepare: showNewPosts });
  }

  const revealFromEffect = useEffectEvent(reveal);

  useEffect(() => {
    if (preview || pending) return;

    const timer = window.setTimeout(async () => {
      const next = await checkNewPosts(kind);
      if (!next) return;
      if (isAtTop()) revealFromEffect(false);
      else setPreview(next);
    }, NEW_POSTS_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [kind, preview, pending]);

  useEffect(() => {
    if (!preview) return;

    function onScroll() {
      if (isAtTop()) revealFromEffect(false);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key !== LOAD_NEW_POSTS_KEY ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isTypingTarget(event.target)
      ) {
        return;
      }
      event.preventDefault();
      revealFromEffect(true);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [preview]);

  const visible = preview !== null;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-full -z-1 flex justify-center pt-4">
      <div
        inert={!visible}
        className={cn(
          "transition-[transform,opacity] duration-150",
          visible ? "translate-y-0 opacity-100" : "-translate-y-[52.5px] opacity-0",
        )}
      >
        <button
          type="button"
          aria-label="New posts are available. Push the period key to go to the them."
          onClick={() => reveal(true)}
          className="pointer-events-auto flex items-center rounded-full bg-accent px-4 py-1 text-base text-white shadow-pill outline-none transition-[background-color,box-shadow] duration-200 hover:bg-accent-hover active:bg-accent-pressed focus-visible:shadow-[0_0_0_2px_var(--color-menu-focus-ring)]"
        >
          <ArrowUpIcon className="size-5 shrink-0" />
          <span className="ml-1 mr-0.5 flex">
            {preview?.authors.map((author, index, authors) => (
              <span
                key={author.id}
                style={{ zIndex: authors.length - index }}
                className={cn("relative flex", index > 0 && "-ml-3")}
              >
                <Avatar
                  src={author.avatarUrl}
                  alt=""
                  size="sm"
                  className="border border-accent bg-accent"
                />
              </span>
            ))}
          </span>
          <span className="ml-1 whitespace-nowrap">posted</span>
        </button>
      </div>
    </div>
  );
}
