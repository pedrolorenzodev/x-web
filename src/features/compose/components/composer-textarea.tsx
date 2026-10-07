"use client";

import Link from "next/link";
import type { ComponentProps, Ref } from "react";
import { routes } from "@/config/routes";
import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { cn } from "@/lib/utils";

type ComposerTextareaProps = Omit<
  ComponentProps<"textarea">,
  "value" | "onChange" | "ref"
> & {
  value: string;
  onValueChange: (value: string) => void;
  textareaRef?: Ref<HTMLTextAreaElement>;
};

const typography =
  "p-0.5 text-xl break-words whitespace-pre-wrap [overflow-wrap:anywhere]";

export function ComposerTextarea({
  value,
  onValueChange,
  textareaRef,
  className,
  ...textareaProps
}: ComposerTextareaProps) {
  const characters = [...value];
  const overflow = characters.length > MAX_TWEET_LENGTH;

  return (
    <div className="grid grid-cols-1">
      {overflow ? (
        <div
          aria-hidden
          className={cn(typography, "[grid-area:1/1] text-transparent")}
        >
          {characters.slice(0, MAX_TWEET_LENGTH).join("")}
          <mark className="bg-overflow-highlight text-transparent">
            {characters.slice(MAX_TWEET_LENGTH).join("")}
          </mark>
        </div>
      ) : null}
      <textarea
        {...textareaProps}
        ref={textareaRef}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        className={cn(
          typography,
          "field-sizing-content relative block w-full resize-none bg-transparent outline-none [grid-area:1/1] placeholder:text-muted",
          className,
        )}
      />
    </div>
  );
}

export function PremiumUpsell() {
  return (
    <div className="mt-4 rounded-lg bg-premium-tint p-4 text-base">
      <p>Upgrade to Premium to write longer posts and Articles.</p>
      <Link
        href={routes.premium}
        className="mt-1 inline-block font-bold underline"
      >
        Upgrade to Premium
      </Link>
    </div>
  );
}
