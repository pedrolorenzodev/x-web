import { PlusIcon } from "@/components/ui/icons";
import { Tab } from "@/components/ui/tab";
import { cn } from "@/lib/utils";

const interactive =
  "transition-colors duration-200 ease-[ease] hover:bg-foreground/10";

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
