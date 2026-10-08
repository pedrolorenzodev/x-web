import type { ReactNode } from "react";
import { BackButton } from "@/components/layout/back-button";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: boolean;
  align?: "start" | "center";
  size?: "default" | "compact";
  action?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  back = true,
  align = "start",
  size = "default",
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className={cn("top-0 z-3", size === "compact" ? "relative" : "sticky")}>
      <div className="relative z-0 bg-background/65 backdrop-blur-[12px]">
        <div
          className={cn(
            "relative flex items-center px-4",
            size === "compact" ? "h-12" : "h-[53px]",
          )}
        >
          {back ? (
            <div className={cn("min-w-14", size === "compact" && "ml-1.5")}>
              <BackButton />
            </div>
          ) : null}
          <div
            className={cn(
              "flex min-w-0 grow flex-col",
              align === "center" &&
                "pointer-events-none absolute inset-x-[72px] items-center",
            )}
          >
            <h2
              className={cn(
                "truncate py-0.5 text-xl font-bold",
                align === "center" && "text-lg",
              )}
            >
              {title}
            </h2>
            {subtitle ? (
              <span className="truncate text-xs text-muted">{subtitle}</span>
            ) : null}
          </div>
          {action ? (
            <div className="ml-auto flex shrink-0 items-center pl-4">
              {action}
            </div>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
