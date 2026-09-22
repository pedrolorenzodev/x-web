import { MoreHorizontalIcon } from "@/components/ui/icons";

export function MoreButton() {
  return (
    <button
      type="button"
      aria-label="More"
      className="group/more relative flex h-5 shrink-0 items-center text-muted transition-colors duration-200 ease-[ease] hover:text-accent"
    >
      <span className="relative flex size-[18.75px]">
        <span className="absolute -inset-2 rounded-full transition-colors duration-200 ease-[ease] group-hover/more:bg-accent/10" />
        <MoreHorizontalIcon className="relative size-[18.75px]" />
      </span>
    </button>
  );
}
