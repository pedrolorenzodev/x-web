import Link from "next/link";
import type { ReactNode } from "react";
import type { ToggleFollow, User } from "@/types/user";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { RichText } from "@/components/ui/rich-text";
import { UserBadges } from "@/components/ui/verified-badge";
import { FollowButton } from "@/components/user/follow-button";

type UserCellProps = {
  user: User;
  viewerId: string;
  toggleFollow: ToggleFollow;
  action?: ReactNode;
  className?: string;
};

export function UserCell({
  user,
  viewerId,
  toggleFollow,
  action,
  className,
}: UserCellProps) {
  const isViewer = user.id === viewerId;

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
            <span className="flex min-w-0 items-center">
              <span className="truncate font-bold">{user.displayName}</span>
              <UserBadges user={user} />
            </span>
            <span className="flex min-w-0 items-center">
              <span className="truncate text-muted">@{user.handle}</span>
              {user.followsViewer && !isViewer ? (
                <span className="ml-1 shrink-0 rounded-[4px] bg-[#202327] px-1 py-0.5 text-[11px] leading-3 text-muted">
                  Follows you
                </span>
              ) : null}
            </span>
          </div>
          {isViewer ? null : (action ?? (
            <FollowButton
              userId={user.id}
              handle={user.handle}
              following={user.followedByViewer}
              toggleFollow={toggleFollow}
            />
          ))}
        </div>
        {user.bio ? (
          <p className="mt-1 text-base break-words whitespace-pre-line">
            <RichText text={user.bio} />
          </p>
        ) : null}
      </div>
    </div>
  );
}
