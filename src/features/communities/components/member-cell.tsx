import Link from "next/link";
import type { CommunityMember, CommunityRole } from "@/types/community";
import type { ToggleFollow } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { RichText } from "@/components/ui/rich-text";
import { UserBadges } from "@/components/ui/verified-badge";
import { FollowButton } from "@/components/user/follow-button";

const roleLabels: Record<CommunityRole, string> = {
  admin: "Admin",
  moderator: "Mod",
  member: "Member",
};

type MemberCellProps = {
  member: CommunityMember;
  viewerId: string;
  toggleFollow: ToggleFollow;
  showRole?: boolean;
  showBio?: boolean;
};

export function MemberCell({
  member: { user, role },
  viewerId,
  toggleFollow,
  showRole = true,
  showBio = false,
}: MemberCellProps) {
  return (
    <div className="relative flex gap-2 px-4 py-3 transition-colors duration-200 ease-[ease] hover:bg-white/3">
      <Link
        href={routes.profile(user.handle)}
        aria-label={user.displayName}
        className="absolute inset-0"
      />
      <Avatar
        src={user.avatarUrl}
        alt={user.displayName}
        className="mt-px"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2">
          <div className="flex min-h-[42px] min-w-0 flex-1 flex-col text-base">
            <span className="flex min-w-0 items-center">
              <span className="truncate font-bold">{user.displayName}</span>
              <UserBadges user={user} />
              {showRole ? (
                <span className="ml-1 shrink-0 rounded-[4px] bg-[rgb(181_184_187)] px-1.5 py-0.5 text-[13px] leading-4 font-bold text-[rgb(22_24_28)]">
                  {roleLabels[role]}
                </span>
              ) : null}
            </span>
            <span className="truncate text-muted">@{user.handle}</span>
          </div>
          {user.id === viewerId ? null : (
            <FollowButton
              userId={user.id}
              handle={user.handle}
              following={user.followedByViewer}
              toggleFollow={toggleFollow}
              size="md"
            />
          )}
        </div>
        {showBio && user.bio ? (
          <p className="mt-1 text-base break-words whitespace-pre-line">
            <RichText text={user.bio} />
          </p>
        ) : null}
      </div>
    </div>
  );
}
