import Image from "next/image";
import Link from "next/link";
import type { ToggleFollow, User } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { Facepile } from "@/components/ui/facepile";
import { VerifiedIcon } from "@/components/ui/icons";
import { RichText } from "@/components/ui/rich-text";
import { UserBadges } from "@/components/ui/verified-badge";
import { cn } from "@/lib/utils";
import { formatFollowedBy } from "@/utils/format-followed-by";
import { formatProfileCount } from "@/utils/format-profile-count";
import { ProfileActions } from "@/features/profile/components/profile-actions";
import { ProfileMeta } from "@/features/profile/components/profile-meta";
import { canViewPosts } from "@/features/profile/utils/can-view-posts";

type ProfileHeaderProps = {
  profile: User;
  isViewer: boolean;
  toggleFollow: ToggleFollow;
};

function Banner({ profile }: { profile: User }) {
  if (!profile.bannerUrl) {
    return <div className="aspect-[3/1] w-full bg-border-strong" />;
  }

  return (
    <Link
      href={routes.profileHeaderPhoto(profile.handle)}
      scroll={false}
      className="relative block aspect-[3/1] w-full bg-border-strong"
    >
      <Image
        src={profile.bannerUrl}
        alt=""
        fill
        sizes="600px"
        className="object-cover"
      />
    </Link>
  );
}

function CountLink({
  href,
  value,
  label,
}: {
  href: string;
  value: number;
  label: string;
}) {
  return (
    <Link href={href} className="text-sm hover:underline">
      <span className="font-bold">{formatProfileCount(value)}</span>{" "}
      <span className="text-muted">{label}</span>
    </Link>
  );
}

function FollowedByRow({ profile }: { profile: User }) {
  const text = formatFollowedBy(profile.followedByPreview);

  if (!text) {
    return (
      <p className="mt-3 text-xs text-muted">
        Not followed by anyone you’re following
      </p>
    );
  }

  return (
    <Link
      href={routes.followersYouFollow(profile.handle)}
      className="mt-3 flex min-h-6 items-center gap-1 text-xs text-muted hover:underline"
    >
      <Facepile
        users={profile.followedByPreview.users.slice(0, 3)}
        size={22}
        overlap={10}
        className="mr-1"
      />
      <span className="line-clamp-2">{text}</span>
    </Link>
  );
}

function GetVerifiedPill() {
  return (
    <Link
      href={routes.premium}
      className="ml-1 flex h-6 shrink-0 items-center rounded-full border border-outline px-3 text-base font-bold transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
    >
      <VerifiedIcon className="mr-1 size-4 text-accent" />
      Get verified
    </Link>
  );
}

export function ProfileHeader({
  profile,
  isViewer,
  toggleFollow,
}: ProfileHeaderProps) {
  return (
    <div>
      <Banner profile={profile} />

      <div className="mb-4 px-4 pt-3">
        <div className="flex items-start justify-between">
          <Link
            href={routes.profilePhoto(profile.handle)}
            scroll={false}
            aria-label="Opens profile photo"
            className="group/avatar relative -mt-[84.9px] mb-3 flex rounded-full bg-background p-1"
          >
            <Avatar
              src={profile.avatarUrl}
              alt={profile.displayName}
              size="xl"
            />
            <span className="absolute inset-1 rounded-full transition-colors duration-200 ease-[ease] group-hover/avatar:bg-black/15" />
          </Link>

          <div className="mb-3 flex gap-2">
            {isViewer ? (
              <Link
                href={routes.editProfile}
                scroll={false}
                data-testid="editProfileButton"
                className={cn(
                  buttonStyles({ variant: "outline" }),
                  "border-outline duration-200 ease-[ease]",
                )}
              >
                Edit profile
              </Link>
            ) : (
              <ProfileActions
                userId={profile.id}
                handle={profile.handle}
                isProtected={profile.protected}
                following={profile.followedByViewer}
                notificationsOn={profile.notificationsOn}
                toggleFollow={toggleFollow}
              />
            )}
          </div>
        </div>

        <div className="mt-1 mb-3 flex flex-col">
          <div className="flex min-w-0 items-center">
            <h1 className="truncate text-xl font-extrabold">
              {profile.displayName}
            </h1>
            <UserBadges user={profile} size="md" />
            {isViewer && !profile.verified ? <GetVerifiedPill /> : null}
          </div>
          <div className="mt-0.5 flex min-w-0 items-center">
            <span className="truncate text-base text-muted">
              @{profile.handle}
            </span>
            {profile.followsViewer && !isViewer ? (
              <span className="ml-1 shrink-0 rounded-[4px] bg-[#202327] px-1 py-0.5 text-[11px] leading-3 text-muted">
                Follows you
              </span>
            ) : null}
          </div>
        </div>

        {profile.bio ? (
          <p className="mb-3 text-base break-words whitespace-pre-wrap">
            <RichText text={profile.bio} />
          </p>
        ) : null}

        <ProfileMeta profile={profile} isViewer={isViewer} />

        <div className="flex h-5 items-center gap-5">
          <CountLink
            href={routes.following(profile.handle)}
            value={profile.followingCount}
            label="Following"
          />
          <CountLink
            href={routes.verifiedFollowers(profile.handle)}
            value={profile.followersCount}
            label="Followers"
          />
        </div>

        {canViewPosts(profile, isViewer) && !isViewer ? (
          <FollowedByRow profile={profile} />
        ) : null}
      </div>
    </div>
  );
}
