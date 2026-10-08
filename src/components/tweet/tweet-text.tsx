"use client";

import { useState } from "react";
import { RichText } from "@/components/ui/rich-text";
import { UserHoverCard } from "@/components/user/user-hover-card";
import { cn } from "@/lib/utils";
import { truncateForCard } from "@/utils/parse-tweet-text";

type TweetTextProps = {
  text: string;
  expandable?: boolean;
  highlightTerms?: string[];
  className?: string;
};

export function TweetText({
  text,
  expandable = true,
  highlightTerms,
  className,
}: TweetTextProps) {
  const [expanded, setExpanded] = useState(false);
  const truncated = expandable && !expanded ? truncateForCard(text) : null;

  return (
    <>
      <div
        data-testid="tweetText"
        className={cn("text-base break-words whitespace-pre-wrap", className)}
      >
        <RichText
          text={truncated ?? text}
          highlightTerms={highlightTerms}
          renderMention={(handle, link) => (
            <UserHoverCard handle={handle}>{link}</UserHoverCard>
          )}
        />
      </div>
      {truncated ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="relative self-start text-base text-accent hover:underline"
        >
          Show more
        </button>
      ) : null}
    </>
  );
}
