import { cn } from "@/lib/utils";

type SpinnerProps = {
  label?: string;
  className?: string;
};

export function Spinner({ label = "Loading", className }: SpinnerProps) {
  return (
    <span
      role="progressbar"
      aria-label={label}
      className={cn("block size-[26px] text-accent", className)}
    >
      <svg
        viewBox="0 0 32 32"
        className="size-full animate-spin [animation-duration:0.75s]"
      >
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          strokeWidth="4"
          className="stroke-current opacity-20"
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          strokeWidth="4"
          strokeDasharray="80"
          strokeDashoffset="60"
          className="stroke-current"
        />
      </svg>
    </span>
  );
}

export function SpinnerRow({ label }: { label?: string }) {
  return (
    <div className="flex h-[66px] items-center justify-center">
      <Spinner label={label} />
    </div>
  );
}

export function ProgressBar({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      className="relative h-[3px] w-full overflow-hidden bg-accent/20"
    >
      <span className="t-progress-indeterminate absolute inset-y-0 w-1/3 bg-accent" />
    </div>
  );
}
