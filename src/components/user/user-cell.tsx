import Link from "next/link";
import type { User } from "@/types/user";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type UserCellProps = {
  user: User;
  viewerId: string;
  className?: string;
};

export function UserCell({ user, viewerId, className }: UserCellProps) {
  return (
    <div
      className={cn(
        "relative flex cursor-pointer gap-2 px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3",
        className,
      )}
    >
      <Link
        href={routes.profile(user.handle)}
        aria-label={user.displayName}
        className="absolute inset-0"
      />
      <Avatar src={user.avatarUrl} alt={user.displayName} />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 flex-col text-base">
            <span className="truncate font-bold">{user.displayName}</span>
            <span className="truncate text-muted">@{user.handle}</span>
          </div>
          {user.id === viewerId ? null : (
            <Button
              size="sm"
              variant={user.followedByViewer ? "outline" : "primary"}
              className="relative shrink-0"
            >
              {user.followedByViewer ? "Following" : "Follow"}
            </Button>
          )}
        </div>
        {user.bio ? (
          <p className="mt-1 text-base break-words">{user.bio}</p>
        ) : null}
      </div>
    </div>
  );
}
