"use client";

import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  readCssMilliseconds,
  readCssProperty,
} from "@/utils/css-custom-property";

type AnimatedCountProps = {
  value: number;
  format: (value: number) => string;
  className?: string;
};

type Trend = 1 | -1;

type Column = {
  key: string;
  text: string;
  from: string | undefined;
};

function isDigit(character: string) {
  return character >= "0" && character <= "9";
}

function alignFromEnd(text: string, from: string): Column[] {
  const characters = [...text];
  const previous = [...from];
  return characters.map((character, index) => {
    const fromEnd = characters.length - 1 - index;
    const kind = isDigit(character) ? "digit" : character;
    return {
      key: `${fromEnd}:${kind}`,
      text: character,
      from: previous[previous.length - 1 - fromEnd],
    };
  });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function rollSequence(from: number, to: number, trend: Trend) {
  const sequence = [from];
  let digit = from;
  while (digit !== to) {
    digit = (digit + trend + 10) % 10;
    sequence.push(digit);
  }
  return sequence;
}

type ReelColumnProps = {
  digit: number;
  from: number;
  trend: Trend;
  revision: number;
  entering: boolean;
};

function ReelColumn({
  digit,
  from,
  trend,
  revision,
  entering,
}: ReelColumnProps) {
  const stripRef = useRef<HTMLSpanElement>(null);
  const sequence =
    revision > 0 && from !== digit ? rollSequence(from, digit, trend) : [digit];
  const steps = sequence.length - 1;
  const rising = trend > 0;
  const cells = rising ? sequence : [...sequence].reverse();
  const restOffset = rising ? steps : 0;

  useLayoutEffect(() => {
    const strip = stripRef.current;
    if (!strip || steps === 0 || prefersReducedMotion()) return;
    const cell = strip.firstElementChild?.getBoundingClientRect().height ?? 0;
    const start = `translateY(${rising ? 0 : -cell * steps}px)`;
    const end = `translateY(${rising ? -cell * steps : 0}px)`;
    const animation = strip.animate(
      [{ transform: start }, { transform: end }],
      {
        duration: readCssMilliseconds("--reel-dur"),
        easing: readCssProperty("--reel-ease"),
      },
    );
    return () => animation.cancel();
  }, [revision, steps, rising]);

  return (
    <span className={cn("t-reel-col", entering && "is-entering")}>
      <span
        ref={stripRef}
        className="t-reel-strip"
        style={{ "--reel-offset": restOffset } as CSSProperties}
      >
        {cells.map((cell, index) => (
          <span key={index} className="t-reel-digit">
            {cell}
          </span>
        ))}
      </span>
    </span>
  );
}

export function AnimatedCount({ value, format, className }: AnimatedCountProps) {
  const [change, setChange] = useState({ value, from: value, revision: 0 });

  if (value !== change.value) {
    setChange({ value, from: change.value, revision: change.revision + 1 });
  }

  if (value <= 0) return null;

  const text = format(value);
  const changed = change.revision > 0;
  const trend: Trend = change.value >= change.from ? 1 : -1;
  const previousText = change.from > 0 ? format(change.from) : "";
  const columns = alignFromEnd(text, previousText);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="t-reel">
        {columns.map(({ key, text: character, from }) => {
          const entering = changed && from === undefined;
          if (!isDigit(character)) {
            return (
              <span
                key={key}
                className={cn("t-reel-col", entering && "is-entering")}
              >
                <span className="t-reel-digit">{character}</span>
              </span>
            );
          }
          return (
            <ReelColumn
              key={key}
              digit={Number(character)}
              from={from !== undefined && isDigit(from) ? Number(from) : 0}
              trend={trend}
              revision={change.revision}
              entering={entering}
            />
          );
        })}
      </span>
    </span>
  );
}
