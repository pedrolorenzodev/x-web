import { ExploreIcon } from "@/components/ui/icons";

export function SearchBox() {
  return (
    <div
      role="search"
      className="flex h-11 items-center rounded-full border border-border-strong"
    >
      <span className="flex w-[29px] shrink-0 pl-[13px]">
        <ExploreIcon className="size-4 text-muted" />
      </span>
      <input
        type="search"
        placeholder="Search"
        className="h-10 w-full bg-transparent pr-4 pl-1 text-sm outline-none placeholder:text-muted"
      />
    </div>
  );
}
