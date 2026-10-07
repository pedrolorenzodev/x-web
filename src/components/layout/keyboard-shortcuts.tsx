"use client";

import { useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useRef } from "react";
import { routes } from "@/config/routes";

const CHORD_TIMEOUT = 1500;
const POST_SELECTOR = 'main article[data-testid="tweet"]';
const SEARCH_SELECTOR = 'input[aria-label="Search query"]';

function isTyping(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

function hasOpenDialog() {
  return Array.from(document.querySelectorAll('[aria-modal="true"]')).some(
    (dialog) => dialog.checkVisibility(),
  );
}

function visiblePosts() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(POST_SELECTOR),
  ).filter((post) => post.checkVisibility());
}

function selectedPost() {
  return document.activeElement?.closest<HTMLElement>(POST_SELECTOR) ?? null;
}

function selectPost(post: HTMLElement) {
  post.tabIndex = -1;
  post.focus({ preventScroll: true });
  post.scrollIntoView({ block: "center" });
}

function movePost(step: 1 | -1) {
  const posts = visiblePosts();
  if (posts.length === 0) return;
  const current = selectedPost();
  const index = current ? posts.indexOf(current) : -1;
  const next =
    index === -1 ? posts[0] : posts[Math.min(Math.max(index + step, 0), posts.length - 1)];
  selectPost(next);
}

function clickInPost(selector: string) {
  selectedPost()?.querySelector<HTMLElement>(selector)?.click();
}

function focusSearch() {
  const search = Array.from(
    document.querySelectorAll<HTMLInputElement>(SEARCH_SELECTOR),
  ).find((input) => input.checkVisibility());
  search?.focus();
  return Boolean(search);
}

export function KeyboardShortcuts({ handle }: { handle: string }) {
  const router = useRouter();
  const chordRef = useRef<"g" | null>(null);
  const chordTimer = useRef<number | undefined>(undefined);

  const chordRoutes: Record<string, string> = {
    h: routes.home,
    e: routes.explore,
    n: routes.notifications,
    r: routes.notificationsMentions,
    p: routes.profile(handle),
    f: routes.composeDrafts,
    t: routes.composeScheduled,
    l: routes.historyLikes,
    i: routes.lists(handle),
    m: routes.chat,
    g: routes.grok,
    c: routes.creatorStudio,
    s: routes.settings,
    b: routes.history,
    d: routes.settingsDisplay,
  };

  const singleActions: Record<string, () => void> = {
    "?": () => router.push(routes.keyboardShortcuts),
    n: () => router.push(routes.composePost),
    "/": () => {
      if (!focusSearch()) router.push(routes.explore);
    },
    j: () => movePost(1),
    k: () => movePost(-1),
    l: () => clickInPost('button[aria-label$="Like"], button[aria-label$="Unlike"]'),
    r: () => clickInPost('a[aria-label$="Reply"]'),
    t: () => clickInPost('button[aria-label$="Repost"], button[aria-label$="Undo repost"]'),
    b: () => clickInPost('button[aria-label="Bookmark"], button[aria-label="Remove Bookmark"]'),
    s: () => clickInPost('button[aria-label="Share post"]'),
    o: () => clickInPost('a[href*="/photo/"]'),
    Enter: () => clickInPost('a[aria-label^="Post by"]'),
  };

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    if (isTyping(event.target)) return;
    if (hasOpenDialog()) return;

    if (chordRef.current === "g") {
      chordRef.current = null;
      window.clearTimeout(chordTimer.current);
      if (event.key === "u") {
        event.preventDefault();
        if (!focusSearch()) router.push(routes.explore);
        return;
      }
      const href = chordRoutes[event.key];
      if (href) {
        event.preventDefault();
        router.push(href);
      }
      return;
    }

    if (event.key === "g") {
      chordRef.current = "g";
      window.clearTimeout(chordTimer.current);
      chordTimer.current = window.setTimeout(() => {
        chordRef.current = null;
      }, CHORD_TIMEOUT);
      return;
    }

    if (event.key === "Enter" && !selectedPost()) return;
    const action = singleActions[event.key];
    if (!action) return;
    event.preventDefault();
    action();
  });

  useEffect(() => {
    function listener(event: KeyboardEvent) {
      onKeyDown(event);
    }
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
      window.clearTimeout(chordTimer.current);
    };
  }, []);

  return null;
}
