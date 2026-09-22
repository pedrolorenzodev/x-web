"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  EmojiIcon,
  FlagIcon,
  GifIcon,
  LocationIcon,
  MediaIcon,
} from "@/components/ui/icons";
import {
  ComposerToolbar,
  type ComposerTool,
} from "@/features/compose/components/composer-toolbar";
import {
  CharacterCounter,
  countCharacters,
} from "@/features/compose/components/character-counter";
import { usePublish } from "@/features/compose/hooks/use-publish";
import { cn } from "@/lib/utils";

type ReplyComposerProps = {
  viewer: UserSummary;
  replyTo: UserSummary;
  tweetId: string;
};

const tools: ComposerTool[] = [
  { label: "Add photos or video", icon: MediaIcon },
  { label: "Add a GIF", icon: GifIcon },
  { label: "Add emoji", icon: EmojiIcon },
  { label: "Tag location", icon: LocationIcon, disabled: true },
  { label: "Content disclosure", icon: FlagIcon },
];

export function ReplyComposer({
  viewer,
  replyTo,
  tweetId,
}: ReplyComposerProps) {
  const [text, setText] = useState("");
  const [expanded, setExpanded] = useState(false);
  const { pending, publish } = usePublish();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const length = countCharacters(text);
  const empty = text.trim().length === 0;
  const tooLong = length > MAX_TWEET_LENGTH;

  function reply() {
    publish({ text, replyToId: tweetId }, () => {
      setText("");
      setExpanded(false);
      textareaRef.current?.blur();
    });
  }

  return (
    <div
      className={cn(
        "relative border-b border-border px-4 pt-1",
        expanded ? "pb-5" : "pb-3",
      )}
    >
      {pending ? (
        <div
          role="progressbar"
          aria-label="Posting"
          className="absolute inset-x-0 top-0 h-[3px] bg-accent"
        />
      ) : null}

      {expanded ? (
        <div className="ml-12 flex h-5 items-center gap-1 text-base text-muted">
          Replying to
          <Link
            href={routes.profile(replyTo.handle)}
            className="text-accent hover:underline"
          >
            @{replyTo.handle}
          </Link>
        </div>
      ) : null}

      <div
        className={cn(
          "flex gap-2",
          expanded ? "mt-3" : "h-[68px] items-center",
        )}
      >
        <Avatar src={viewer.avatarUrl} alt={viewer.displayName} />

        <div
          className={cn(
            "flex min-w-0 flex-1",
            expanded ? "flex-col" : "h-14 items-center",
          )}
        >
          <div className={cn("min-w-0 flex-1", expanded && "min-h-12 pt-1.5")}>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onFocus={() => setExpanded(true)}
              placeholder="Post your reply"
              aria-label="Post text"
              rows={1}
              className={cn(
                "field-sizing-content block w-full resize-none bg-transparent px-0.5 text-xl outline-none placeholder:text-muted",
                expanded && "py-0.5",
              )}
            />
          </div>

          <div className={cn("flex items-center", expanded && "pt-2")}>
            {expanded ? <ComposerToolbar tools={tools} /> : null}
            <div
              className={cn(
                "flex items-center gap-3",
                expanded ? "ml-auto" : "ml-3",
              )}
            >
              {expanded ? <CharacterCounter length={length} /> : null}
              <Button
                disabled={empty || tooLong || pending}
                onClick={reply}
                className="disabled:opacity-25"
              >
                Reply
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
