"use client";

import { startTransition, useOptimistic } from "react";
import type { Poll } from "@/types/tweet";
import { CheckCircleFillIcon } from "@/components/ui/icons";
import { useTweetServices } from "@/components/tweet/tweet-services-context";
import {
  formatPollPercentage,
  formatPollTimeLeft,
  isPollClosed,
} from "@/utils/format-poll-status";
import { cn } from "@/lib/utils";

type TweetPollProps = {
  tweetId: string;
  poll: Poll;
};

function castVote(poll: Poll, optionIndex: number): Poll {
  return {
    ...poll,
    viewerVoteIndex: optionIndex,
    options: poll.options.map((option, index) =>
      index === optionIndex ? { ...option, votes: option.votes + 1 } : option,
    ),
  };
}

function PollResults({ poll, total }: { poll: Poll; total: number }) {
  const leading = Math.max(...poll.options.map((option) => option.votes));

  return (
    <ul className="flex flex-col gap-1">
      {poll.options.map((option, index) => {
        const winner = option.votes === leading && leading > 0;
        const share = total > 0 ? option.votes / total : 0;

        return (
          <li
            key={option.label}
            className={cn(
              "relative flex h-8 items-center justify-between gap-3 text-base",
              winner && "font-bold",
            )}
          >
            <div
              style={{ width: `max(${share * 100}%, 4px)` }}
              className={cn(
                "absolute inset-y-0 left-0 rounded-[4px]",
                winner ? "bg-accent/58" : "bg-border-strong",
              )}
            />
            <span className="relative flex min-w-0 items-center gap-1.5 pl-3">
              <span className="truncate">{option.label}</span>
              {poll.viewerVoteIndex === index ? (
                <>
                  <CheckCircleFillIcon className="size-[18px] shrink-0" />
                  <span className="sr-only">Your choice</span>
                </>
              ) : null}
            </span>
            <span className="relative shrink-0">
              {formatPollPercentage(option.votes, total)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function TweetPoll({ tweetId, poll }: TweetPollProps) {
  const services = useTweetServices();
  const [current, vote] = useOptimistic(poll, castVote);
  const total = current.options.reduce((sum, option) => sum + option.votes, 0);
  const closed = isPollClosed(current.endsAt);
  const showResults = closed || current.viewerVoteIndex !== null;

  function choose(optionIndex: number) {
    if (!services) return;
    startTransition(async () => {
      vote(optionIndex);
      await services.votePoll(tweetId, optionIndex);
    });
  }

  return (
    <div data-testid="cardPoll" className="relative mt-3">
      {showResults ? (
        <PollResults poll={current} total={total} />
      ) : (
        <div
          role="radiogroup"
          aria-label="Poll options"
          className="flex flex-col gap-1"
        >
          {current.options.map((option, index) => (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={false}
              disabled={!services}
              onClick={() => choose(index)}
              className="flex h-8 items-center justify-center rounded-full border border-accent px-[15px] text-base font-bold text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
            >
              <span className="truncate">{option.label}</span>
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 text-base text-muted" suppressHydrationWarning>
        {total.toLocaleString("en-US")} {total === 1 ? "vote" : "votes"} ·{" "}
        {formatPollTimeLeft(current.endsAt)}
      </p>
    </div>
  );
}
