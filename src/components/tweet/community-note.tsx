"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KeyboardEvent, MouseEvent } from "react";
import type { CommunityNote as Note } from "@/types/tweet";
import { routes } from "@/config/routes";
import { CommunityNotesFillIcon } from "@/components/ui/icons";
import { RichText } from "@/components/ui/rich-text";

export function CommunityNote({ note }: { note: Note }) {
  const router = useRouter();
  const href = routes.communityNote(note.id);

  function onClick(event: MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    if ((event.target as HTMLElement).closest("a")) return;
    router.push(href);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" || event.target !== event.currentTarget) return;
    event.preventDefault();
    router.push(href);
  }

  return (
    <>
      <div
        role="link"
        tabIndex={0}
        data-testid="birdwatch-pivot"
        onClick={onClick}
        onKeyDown={onKeyDown}
        className="mt-3 cursor-pointer overflow-hidden rounded-2xl border border-border outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] hover:bg-white/3 focus-visible:shadow-[0_0_0_2px_var(--color-menu-focus-ring)]"
      >
        <div className="flex items-start bg-white/3 p-3">
          <CommunityNotesFillIcon className="mr-2 size-[18.75px] shrink-0 text-accent" />
          <p className="py-0.5 text-sm font-bold">
            Readers added context they thought people might want to know
          </p>
        </div>
        <div className="mt-3 px-3 text-base break-words whitespace-pre-wrap">
          <RichText text={note.text} />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 border-t border-border p-3">
          <span className="text-sm">Do you find this helpful?</span>
          <Link
            href={href}
            className="flex h-8 shrink-0 items-center rounded-full border border-outline px-4 text-sm font-bold transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
          >
            Rate it
          </Link>
        </div>
      </div>
      <p className="py-3 text-xs text-muted">
        Context is written by people who use X, and appears when rated helpful
        by others.{" "}
        <Link
          href={routes.communityNotesJoin}
          onClick={(event) => event.stopPropagation()}
          className="text-accent hover:underline"
        >
          Find out more
        </Link>
        .
      </p>
    </>
  );
}
