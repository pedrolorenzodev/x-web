import { MAX_TWEET_LENGTH } from "@/config/tweet";
import { cn } from "@/lib/utils";

const WARNING_AT = 20;

export function countCharacters(text: string) {
  return [...text].length;
}

export function CharacterCounter({ length }: { length: number }) {
  if (length === 0) return null;

  const remaining = MAX_TWEET_LENGTH - length;
  const warning = remaining <= WARNING_AT;
  const size = warning ? 30 : 20;
  const radius = warning ? 15 : 10;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(length / MAX_TWEET_LENGTH, 1);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={MAX_TWEET_LENGTH}
      aria-valuenow={length}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        viewBox={`0 0 ${size + 4} ${size + 4}`}
        className="absolute -inset-0.5 -rotate-90 overflow-visible"
      >
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          strokeWidth={2}
          className="stroke-border"
        />
        <circle
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          strokeWidth={2}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          className={cn(
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
          className={cn(
            "relative text-xs",
            remaining < 0 ? "text-danger" : "text-muted",
          )}
        >
          {remaining}
        </span>
      ) : null}
    </div>
  );
}
