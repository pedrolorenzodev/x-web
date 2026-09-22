import Link from "next/link";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  card,
  heading,
  row,
  showMore,
} from "@/components/layout/right-panel/styles";

type WhoToFollowProps = {
  suggestions: UserSummary[];
};

export function WhoToFollow({ suggestions }: WhoToFollowProps) {
  return (
    <section className={card}>
      <h2 className={heading}>Who to follow</h2>
      {suggestions.map((user) => (
        <div
          key={user.id}
          className={`relative flex items-center gap-3 px-4 py-3 ${row}`}
        >
          <Link
            href={routes.profile(user.handle)}
            aria-label={user.displayName}
            className="absolute inset-0"
          />
          <Avatar src={user.avatarUrl} alt={user.displayName} />
          <span className="flex min-w-0 flex-col">
            <span className="truncate text-base font-bold">
              {user.displayName}
            </span>
            <span className="truncate text-base text-muted">
              @{user.handle}
            </span>
          </span>
          <Button size="sm" className="relative ml-auto shrink-0">
            Follow
          </Button>
        </div>
      ))}
      <button type="button" className={`${showMore} ${row}`}>
        Show more
      </button>
    </section>
  );
}
