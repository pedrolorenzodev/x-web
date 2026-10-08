import Link from "next/link";
import type { ReactNode } from "react";
import type { User } from "@/types/user";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { GrokIcon, SearchIcon } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";
import { UserBadges } from "@/components/ui/verified-badge";
import { formatProfileCount } from "@/utils/format-profile-count";
import { searchHref } from "@/utils/search-href";
import { canViewPosts } from "@/features/profile/utils/can-view-posts";

type ProfileAppBarProps = {
  profile: User;
  isViewer: boolean;
  media: boolean;
};

function AppBarLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <Tooltip label={label}>
      <Link
        href={href}
        aria-label={label}
        className="flex size-9 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
      >
        {children}
      </Link>
    </Tooltip>
  );
}

function subtitleFor(profile: User, media: boolean) {
  if (media) {
    return `${formatProfileCount(profile.mediaCount)} photos & videos`;
  }
  const noun = profile.postsCount === 1 ? "post" : "posts";
  return `${formatProfileCount(profile.postsCount)} ${noun}`;
}

export function ProfileAppBar({ profile, isViewer, media }: ProfileAppBarProps) {
  return (
    <PageHeader
      title={
        <span className="flex min-w-0 items-center">
          <span className="truncate">{profile.displayName}</span>
          <UserBadges user={profile} size="md" />
        </span>
      }
      subtitle={subtitleFor(profile, media)}
      action={
        <div className="flex gap-2">
          {isViewer || !canViewPosts(profile, isViewer) ? null : (
            <AppBarLink href={routes.grok} label="Profile Summary">
              <GrokIcon className="size-5" />
            </AppBarLink>
          )}
          <AppBarLink
            href={searchHref(`from:${profile.handle}`)}
            label="Search"
          >
            <SearchIcon className="size-5" />
          </AppBarLink>
        </div>
      }
    />
  );
}
