"use client";

import { useState, type ReactNode } from "react";
import type { SensitiveMediaWarning } from "@/types/tweet";
import { EyeOffIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const warningLabels: Record<SensitiveMediaWarning, string> = {
  adult_content: "Nudity",
  graphic_violence: "Violence",
  other: "Sensitive content",
};

const warningList = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

function formatWarnings(warnings: SensitiveMediaWarning[]) {
  return warningList.format(
    warnings.map((warning, index) =>
      index === 0
        ? warningLabels[warning]
        : warningLabels[warning].toLowerCase(),
    ),
  );
}

const mediaButton =
  "flex h-8 min-w-8 items-center justify-center rounded-full px-3 text-sm font-bold outline-none transition-[background-color,box-shadow] duration-200 ease-[ease] focus-visible:shadow-[0_0_0_2px_var(--color-menu-focus-ring)]";

type SensitiveMediaProps = {
  warnings: SensitiveMediaWarning[];
  children: ReactNode;
};

export function SensitiveMedia({ warnings, children }: SensitiveMediaProps) {
  const [revealed, setRevealed] = useState(false);

  if (warnings.length === 0) return children;

  if (revealed) {
    return (
      <div className="relative mt-3 *:mt-0">
        {children}
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setRevealed(false);
          }}
          className={cn(
            mediaButton,
            "absolute top-3 right-4 bg-inverted-foreground text-white opacity-75 backdrop-blur-[4px] hover:bg-media-control-hover",
          )}
        >
          Hide
        </button>
      </div>
    );
  }

  return (
    <div className="relative mt-3 min-h-60 overflow-hidden rounded-2xl">
      <div aria-hidden inert className="blur-[30px] *:mt-0">
        {children}
      </div>
      <div
        onClick={(event) => event.stopPropagation()}
        className="absolute inset-0 flex flex-col justify-center rounded-2xl bg-black/50 px-4 py-3"
      >
        <div className="mx-auto flex w-full max-w-[400px] flex-col px-3 text-base text-white">
          <EyeOffIcon className="mb-3 size-6" />
          <p className="mb-3 font-bold">
            Content warning: {formatWarnings(warnings)}
          </p>
          <p>The post author flagged this post as showing sensitive content.</p>
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className={cn(
              mediaButton,
              "mt-3 self-end bg-on-media text-inverted-foreground hover:bg-on-media-hover",
            )}
          >
            Show
          </button>
        </div>
      </div>
    </div>
  );
}
