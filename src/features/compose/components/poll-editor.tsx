"use client";

import {
  MAX_POLL_CHOICE_LENGTH,
  MAX_POLL_CHOICES,
  MAX_POLL_DAYS,
  MIN_POLL_CHOICES,
} from "@/config/compose";
import {
  FloatingLabelInput,
  FloatingLabelSelect,
  type FloatingLabelOption,
} from "@/components/ui/floating-label-field";
import { MediaIcon, PlusIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import type { ComposerPoll } from "@/features/compose/types/composer";

const MIN_MINUTES_WITHOUT_HOURS = 5;

function range(from: number, to: number): FloatingLabelOption[] {
  return Array.from({ length: to - from + 1 }, (_, index) => {
    const value = String(from + index);
    return { value, label: value };
  });
}

function choiceLabel(index: number) {
  const label = `Choice ${index + 1}`;
  return index < MIN_POLL_CHOICES ? label : `${label} (optional)`;
}

function normalize(poll: ComposerPoll): ComposerPoll {
  if (poll.days >= MAX_POLL_DAYS) {
    return { ...poll, days: MAX_POLL_DAYS, hours: 0, minutes: 0 };
  }
  if (poll.days === 0 && poll.hours === 0) {
    return {
      ...poll,
      minutes: Math.max(poll.minutes, MIN_MINUTES_WITHOUT_HOURS),
    };
  }
  return poll;
}

type PollEditorProps = {
  poll: ComposerPoll;
  onChange: (poll: ComposerPoll) => void;
  onRemove: () => void;
};

export function PollEditor({ poll, onChange, onRemove }: PollEditorProps) {
  const maxedOut = poll.days >= MAX_POLL_DAYS;
  const canAddChoice = poll.choices.length < MAX_POLL_CHOICES;

  function update(change: Partial<ComposerPoll>) {
    onChange(normalize({ ...poll, ...change }));
  }

  function setChoice(index: number, value: string) {
    update({
      choices: poll.choices.map((choice, position) =>
        position === index ? value : choice,
      ),
    });
  }

  return (
    <div className="mt-3 mb-1 overflow-hidden rounded-2xl border border-border">
      <div className="flex flex-col gap-3 px-3 pt-3 pb-3">
        {poll.choices.map((choice, index) => {
          const last = index === poll.choices.length - 1;
          return (
            <div key={index} className="flex items-center gap-3">
              <span
                aria-hidden
                className="flex h-[58px] w-16 shrink-0 items-center justify-center rounded-lg border border-dashed border-border-strong text-muted opacity-50"
              >
                <MediaIcon className="size-5" />
              </span>
              <FloatingLabelInput
                label={choiceLabel(index)}
                value={choice}
                maxLength={MAX_POLL_CHOICE_LENGTH}
                autoFocus={index === 0}
                onChange={(value) => setChoice(index, value)}
                className="min-w-0 flex-1"
              />
              <div className="flex w-9 shrink-0 justify-center">
                {last && canAddChoice ? (
                  <Tooltip label="Add a choice">
                    <button
                      type="button"
                      aria-label="Add a choice"
                      onClick={() => update({ choices: [...poll.choices, ""] })}
                      className="flex size-9 items-center justify-center rounded-full text-accent transition-colors duration-200 ease-[ease] hover:bg-accent/10"
                    >
                      <PlusIcon className="size-5" />
                    </button>
                  </Tooltip>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-border px-3 pt-3 pb-4">
        <h3 className="text-base">Poll length</h3>
        <div className="mt-1 flex gap-3">
          <FloatingLabelSelect
            label="Days"
            value={String(poll.days)}
            options={range(0, MAX_POLL_DAYS)}
            onChange={(value) => update({ days: Number(value) })}
            className="flex-1"
          />
          <FloatingLabelSelect
            label="Hours"
            value={String(poll.hours)}
            options={maxedOut ? range(0, 0) : range(0, 23)}
            onChange={(value) => update({ hours: Number(value) })}
            className="flex-1"
          />
          <FloatingLabelSelect
            label="Minutes"
            value={String(poll.minutes)}
            options={
              maxedOut
                ? range(0, 0)
                : poll.days === 0 && poll.hours === 0
                  ? range(MIN_MINUTES_WITHOUT_HOURS, 59)
                  : range(0, 59)
            }
            onChange={(value) => update({ minutes: Number(value) })}
            className="flex-1"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="flex h-[52px] w-full items-center justify-center border-t border-border text-base text-danger transition-colors duration-200 ease-[ease] hover:bg-danger/10"
      >
        Remove poll
      </button>
    </div>
  );
}
