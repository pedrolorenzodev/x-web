import Link from "next/link";
import { routes } from "@/config/routes";
import { SearchIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";

export function CommunitiesSearchLink({
  href = routes.communitiesSuggested,
}: {
  href?: string;
}) {
  return (
    <Tooltip label="Search">
      <Link
        href={href}
        aria-label="Search"
        className="flex size-9 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-inverted/10"
      >
        <SearchIcon className="size-5" />
      </Link>
    </Tooltip>
  );
}
