import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { cn } from "@/lib/utils";

const WARNING_AT = 20;

function describeRemaining(remaining: number) {
  if (remaining < 0) {
    return `You have exceeded the character limit by ${-remaining}`;
  }
  return `${remaining} ${remaining === 1 ? "character" : "characters"} remaining`;
}

export function CharacterCounter({ length }: { length: number }) {
  if (length === 0) return null;

  const remaining = MAX_TWEET_LENGTH - length;
  const warning = remaining <= WARNING_AT;
  const size = warning ? 30 : 20;
  const radius = warning ? 15 : 10;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(length / MAX_TWEET_LENGTH, 1);

  const ring =
    "transition-[r,stroke,stroke-dasharray,stroke-dashoffset] duration-200 ease-[ease] motion-reduce:transition-none";

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={MAX_TWEET_LENGTH}
      aria-valuenow={length}
      aria-valuetext={describeRemaining(remaining)}
      className="relative flex items-center justify-center transition-[width,height] duration-200 ease-[ease]"
      style={{ width: size, height: size }}
    >
      <svg
        className={cn(
          "absolute -inset-0.5 size-[calc(100%+4px)] -rotate-90 overflow-visible transition-opacity duration-200 ease-[ease]",
          remaining < -9 && "opacity-0",
        )}
      >
        <circle
          cx="50%"
          cy="50%"
          fill="none"
          strokeWidth={2}
          style={{ r: radius }}
          className={cn("stroke-border", ring)}
        />
        <circle
          cx="50%"
          cy="50%"
          fill="none"
          strokeWidth={2}
          style={{
            r: radius,
            strokeDasharray: circumference,
            strokeDashoffset: circumference * (1 - progress),
          }}
          className={cn(
            ring,
            remaining < 0
              ? "stroke-danger"
              : warning
                ? "stroke-warning"
                : "stroke-accent",
          )}
        />
      </svg>
      {warning ? (
        <span
          aria-hidden
          className={cn(
            "relative animate-[counter-in_200ms_ease] text-xs motion-reduce:animate-none",
            remaining < 0 ? "text-danger" : "text-muted",
          )}
        >
          {remaining}
        </span>
      ) : null}
    </div>
  );
}
