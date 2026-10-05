import type { ReactNode } from "react";
import { BackButton } from "@/components/layout/back-button";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: boolean;
  align?: "start" | "center";
  action?: ReactNode;
  children?: ReactNode;
};

export function PageHeader({
  title,
  subtitle,
  back = true,
  align = "start",
  action,
  children,
}: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-3">
      <div className="relative z-0 bg-background/65 backdrop-blur-[12px]">
        <div className="flex h-[53px] items-center px-4">
          {back ? (
            <div className="min-w-14">
              <BackButton />
            </div>
          ) : null}
          <div
            className={cn(
              "flex min-w-0 grow flex-col",
              align === "center" && "items-center",
            )}
          >
            <h2 className="truncate py-0.5 text-xl font-bold">{title}</h2>
            {subtitle ? (
              <span className="truncate text-xs text-muted">{subtitle}</span>
            ) : null}
          </div>
          {action ? (
            <div className="ml-4 flex shrink-0 items-center">{action}</div>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
