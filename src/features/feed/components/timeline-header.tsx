import { PlusIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const interactive =
  "transition-colors duration-200 ease-[ease] hover:bg-foreground/10";

type TabProps = {
  label: string;
  active?: boolean;
};

function Tab({ label, active = false }: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      className={cn("flex h-[53px] flex-auto justify-center px-4", interactive)}
    >
      <span
        className={cn(
          "relative flex h-full items-center text-base",
          active ? "font-bold" : "font-medium text-muted",
        )}
      >
        {label}
        {active ? (
          <span className="absolute bottom-0 left-1/2 h-1 w-full min-w-[56px] -translate-x-1/2 rounded-full bg-accent" />
        ) : null}
      </span>
    </button>
  );
}

export function TimelineHeader() {
  return (
    <div className="sticky top-0 z-3">
      <div className="relative z-0 border-b border-border bg-background/65 backdrop-blur-[12px]">
        <div className="flex">
          <div role="tablist" className="flex flex-1">
            <Tab label="For you" active />
            <Tab label="Following" />
          </div>
          <button
            type="button"
            aria-label="Manage timelines"
            className={cn(
              "flex size-[53px] shrink-0 items-center justify-center",
              interactive,
            )}
          >
            <PlusIcon className="size-4 text-muted" />
          </button>
        </div>
      </div>
    </div>
  );
}
