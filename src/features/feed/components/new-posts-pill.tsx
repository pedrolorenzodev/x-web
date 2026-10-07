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
          className="pointer-events-auto flex h-7 items-center rounded-full bg-accent px-4 text-base text-white shadow-[rgba(101,119,134,0.2)_0_0_8px,rgba(101,119,134,0.25)_0_1px_3px_1px]"
        >
          <ArrowUpIcon className="size-5" />
          <span className="ml-1 flex">
            {preview?.authors.map((author, index) => (
              <Avatar
                key={author.id}
                src={author.avatarUrl}
                alt=""
                size="xs"
                className={cn(
                  "border-2 border-white",
                  index > 0 && "-ml-2",
                )}
              />
            ))}
          </span>
          <span className="ml-1">posted</span>
        </button>
      </div>
    </div>
  );
}
