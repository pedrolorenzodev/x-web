"use client";

import { useState } from "react";
import type { ComponentType, SVGProps } from "react";
import type { UserSummary } from "@/types/user";
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
import { cn } from "@/lib/utils";

type ComposerProps = {
  viewer: UserSummary;
};

type Tool = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  disabled?: boolean;
};

const tools: Tool[] = [
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
  const empty = text.trim().length === 0;

  return (
    <div className="group flex gap-2 border-b border-border px-4 pt-4 pb-2">
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
          <div className="-ml-2 flex h-10 items-center">
            {tools.map(({ label, icon: Icon, disabled }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                disabled={disabled}
                className={cn(
                  "group/tool m-0.5 flex size-9 items-center justify-center rounded-full",
                  disabled
                    ? "opacity-50"
                    : `transition-colors ${easing} hover:bg-inverted/10`,
                )}
              >
                <Icon
                  className={cn(
                    "size-[23.25px] text-border-strong brightness-[2.5]",
                    !disabled &&
                      `transition ${easing} group-hover/tool:scale-[1.12] group-hover/tool:brightness-[3.5]`,
                  )}
                />
              </button>
            ))}
          </div>
          <Button disabled={empty} className="ml-auto disabled:opacity-25">
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
