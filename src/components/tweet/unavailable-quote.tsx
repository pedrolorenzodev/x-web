import { cn } from "@/lib/utils";

const LEARN_MORE_HREF = "https://help.x.com/rules-and-policies/notices-on-x";

export function UnavailableQuote({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-menu-hover p-4 text-base text-muted",
        className,
      )}
    >
      This post is unavailable.{" "}
      <a
        href={LEARN_MORE_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent hover:underline"
      >
        Learn more
      </a>
    </div>
  );
}
