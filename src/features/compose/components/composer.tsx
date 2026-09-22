"use client";

import { useState } from "react";
import type { UserSummary } from "@/types/user";
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
import { usePublish } from "@/features/compose/hooks/use-publish";

type ComposerProps = {
  viewer: UserSummary;
};

const tools: ComposerTool[] = [
  { label: "Add photos or video", icon: MediaIcon },
  { label: "Add a GIF", icon: GifIcon },
  { label: "Add poll", icon: PollIcon },
  { label: "Add emoji", icon: EmojiIcon },
  { label: "Schedule post", icon: ScheduleIcon },
  { label: "Tag location", icon: LocationIcon, disabled: true },
  { label: "Content disclosure", icon: FlagIcon },
];

const easing = "duration-200 ease-[ease]";

export function Composer({ viewer }: ComposerProps) {
  const [text, setText] = useState("");
  const { pending, publish } = usePublish();
  const length = countCharacters(text);
  const empty = text.trim().length === 0;
  const tooLong = length > MAX_TWEET_LENGTH;

  function post() {
    publish({ text, replyToId: null }, () => setText(""));
  }

  return (
    <div className="group relative flex gap-2 border-b border-border px-4 pt-4 pb-2">
      {pending ? (
        <div
          role="progressbar"
          aria-label="Posting"
          className="absolute inset-x-0 top-0 h-[3px] bg-accent"
        />
      ) : null}
      <Avatar src={viewer.avatarUrl} alt={viewer.displayName} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="min-h-12 pt-1.5">
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="What’s happening?"
            aria-label="Post text"
            className="field-sizing-content w-full resize-none bg-transparent p-0.5 text-xl outline-none placeholder:text-muted"
          />
        </div>

        <div className="-ml-4 mr-4 max-h-0 overflow-hidden opacity-0 transition-[max-height,opacity] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] group-focus-within:max-h-[60px] group-focus-within:opacity-100">
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

        <div className="flex items-center pt-2">
          <ComposerToolbar tools={tools} />
          <div className="ml-auto flex items-center gap-3">
            <CharacterCounter length={length} />
            <Button
              disabled={empty || tooLong || pending}
              onClick={post}
              className="disabled:opacity-25"
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
