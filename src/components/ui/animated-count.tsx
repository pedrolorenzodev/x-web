"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

type AnimatedCountProps = {
  value: number;
  format: (value: number) => string;
  className?: string;
};

function staggerFor(index: number, length: number) {
  if (index === length - 2) return "1";
  if (index === length - 1) return "2";
  return undefined;
}

export function AnimatedCount({ value, format, className }: AnimatedCountProps) {
  const [previous, setPrevious] = useState(value);
  const [direction, setDirection] = useState(0);

  if (value !== previous) {
    setPrevious(value);
    setDirection(value > previous ? 1 : -1);
  }

  if (value <= 0) return null;
  const characters = [...format(value)];

  return (
    <span
      key={value}
      style={{ "--digit-dir-y": direction } as CSSProperties}
      className={cn("t-digit-group", direction !== 0 && "is-animating", className)}
    >
      {characters.map((character, index) => (
        <span
          key={index}
          className="t-digit"
          data-stagger={staggerFor(index, characters.length)}
        >
          {character}
        </span>
      ))}
    </span>
  );
}
