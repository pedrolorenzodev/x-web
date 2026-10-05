import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ title, body, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "mx-auto my-8 flex max-w-[400px] flex-col px-8",
        className,
      )}
    >
      <h2 className="text-[31px] leading-9 font-extrabold break-words">
        {title}
      </h2>
      {body ? (
        <div className="mt-2 text-base text-muted">{body}</div>
      ) : null}
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
