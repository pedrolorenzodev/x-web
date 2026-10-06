"use client";

import { useState } from "react";
import type { UserSummary } from "@/types/user";
import type { ComposeTarget } from "@/features/compose/types/compose-target";
import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  EmojiIcon,
  FlagIcon,
  GifIcon,
  GlobeIcon,
  LocationIcon,
  MediaIcon,
  PollIcon,
  ScheduleIcon,
} from "@/components/ui/icons";
import {
  ComposerToolbar,
  type ComposerTool,
} from "@/features/compose/components/composer-toolbar";
import {
  CharacterCounter,
  countCharacters,
} from "@/features/compose/components/character-counter";
import { ComposeQuoteCard } from "@/features/compose/components/compose-quote-card";
import { usePublish } from "@/features/compose/hooks/use-publish";
import { cn } from "@/lib/utils";

type ComposerProps = {
  viewer: UserSummary;
  variant?: "inline" | "modal";
  onPublished?: () => void;
  target?: ComposeTarget | null;
};

const placeholders = {
  post: "What’s happening?",
  reply: "Post your reply",
  quote: "Add a comment",
} as const;

const tools: ComposerTool[] = [
  { label: "Add photos or video", tooltip: "Media", icon: MediaIcon },
  { label: "Add a GIF", tooltip: "GIF", icon: GifIcon },
  { label: "Add poll", tooltip: "Poll", icon: PollIcon },
  { label: "Add emoji", tooltip: "Emoji", icon: EmojiIcon },
  { label: "Schedule post", tooltip: "Schedule", icon: ScheduleIcon },
  { label: "Tag location", tooltip: "Location", icon: LocationIcon, disabled: true },
  { label: "Content disclosure", tooltip: "Content disclosure", icon: FlagIcon },
];

const easing = "duration-200 ease-[ease]";

function AudienceRow({ modal }: { modal: boolean }) {
  return (
    <div
      className={cn(
        "mr-4 overflow-hidden",
        modal
          ? "-ml-16 max-h-[60px]"
          : "-ml-4 max-h-0 opacity-0 transition-[max-height,opacity] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:max-h-[60px] group-focus-within:opacity-100",
      )}
    >
      <div className="flex border-b border-border py-3">
        <button
          type="button"
          className={`inline-flex h-6 items-center gap-1 rounded-full border border-transparent px-3 text-sm font-bold text-accent transition-colors ${easing} hover:bg-accent/10`}
        >
          <GlobeIcon className="size-4" />
          Everyone can reply
        </button>
      </div>
    </div>
  );
}

export function Composer({
  viewer,
  variant = "inline",
  onPublished,
  target = null,
}: ComposerProps) {
  const modal = variant === "modal";
  const kind = target?.kind ?? "post";
  const targetId = target?.tweet.id ?? null;
  const [text, setText] = useState("");
  const { pending, publish } = usePublish({ onSettled: onPublished });
  const length = countCharacters(text);
  const empty = text.trim().length === 0;
  const tooLong = length > MAX_TWEET_LENGTH;
  const missingText = empty && kind !== "quote";

  function post() {
    publish(
      {
        text,
        replyToId: kind === "reply" ? targetId : null,
        quotedId: kind === "quote" ? targetId : null,
      },
      () => setText(""),
    );
  }

  return (
    <div
      className={cn(
        "group relative flex gap-2 px-4 pt-4 pb-2",
        !modal && "border-b border-border",
      )}
    >
      {pending ? (
        <div
          role="progressbar"
          aria-label="Posting"
          className="absolute inset-x-0 top-0 h-[3px] bg-accent"
        />
      ) : null}
      <Avatar src={viewer.avatarUrl} alt={viewer.displayName} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div
          className={cn(
            "pt-1.5",
            !modal && "min-h-12",
            modal && (kind === "quote" ? "pb-2" : "pb-3.5"),
          )}
        >
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder={placeholders[kind]}
            aria-label="Post text"
            className={cn(
              "field-sizing-content block w-full resize-none bg-transparent p-0.5 text-xl outline-none placeholder:text-muted",
              modal && kind !== "quote" && "min-h-24",
            )}
          />
          {target?.kind === "quote" ? (
            <ComposeQuoteCard tweet={target.tweet} />
          ) : null}
        </div>

        {kind === "reply" ? null : <AudienceRow modal={modal} />}

        <div className={cn("flex items-center pt-2", modal && "-ml-12")}>
          <ComposerToolbar tools={tools} />
          <div className="ml-auto flex items-center gap-3">
            <CharacterCounter length={length} />
            <Button
              disabled={missingText || tooLong || pending}
              onClick={post}
              className="disabled:opacity-25"
            >
              {kind === "reply" ? "Reply" : "Post"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
