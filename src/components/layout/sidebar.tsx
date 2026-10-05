import Link from "next/link";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "@/components/layout/nav-item";
import { MoreMenu } from "@/components/layout/more-menu";
import { AccountMenu } from "@/components/layout/account-menu";
import {
  BookmarkActiveIcon,
  ChatActiveIcon,
  ChatIcon,
  CreatorStudioActiveIcon,
  CreatorStudioIcon,
  ExploreIcon,
  FollowActiveIcon,
  FollowIcon,
  GrokActiveIcon,
  GrokIcon,
  HistoryIcon,
  HomeActiveIcon,
  HomeIcon,
  MoreHorizontalIcon,
  NotificationsActiveIcon,
  NotificationsIcon,
  PremiumIcon,
  ProfileActiveIcon,
  ProfileIcon,
  SearchIcon,
  VerifiedIcon,
  XLogoIcon,
} from "@/components/ui/icons";

type SidebarProps = {
  viewer: UserSummary;
  unreadNotifications: number;
};

const icon = "size-[26.25px]";

export function Sidebar({ viewer, unreadNotifications }: SidebarProps) {
  const profile = routes.profile(viewer.handle);

  return (
    <header className="w-sidebar shrink-0">
      <div className="fixed top-0 flex h-screen w-sidebar flex-col px-2">
        <Link
          href={routes.home}
          aria-label="X"
          className="mt-0.5 flex size-13 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
        >
          <XLogoIcon className="size-[30px]" />
        </Link>

        <nav aria-label="Primary" className="mt-1 flex flex-col">
          <NavItem
            label="Home"
            href={routes.home}
            match={{ prefixes: [routes.home, "/home"], exact: true }}
            icon={<HomeIcon className={icon} />}
            activeIcon={<HomeActiveIcon className={icon} />}
          />
          <NavItem
            label="Explore"
            href={routes.explore}
            match={{
              prefixes: [routes.explore, routes.search, "/hashtag", "/i/trending"],
            }}
            icon={<ExploreIcon className={icon} />}
            activeIcon={<SearchIcon className={icon} />}
          />
          <NavItem
            label="Notifications"
            href={routes.notifications}
            badge={unreadNotifications}
            icon={<NotificationsIcon className={icon} />}
            activeIcon={<NotificationsActiveIcon className={icon} />}
          />
          <NavItem
            label="Follow"
            href={routes.connectPeople}
            icon={<FollowIcon className={icon} />}
            activeIcon={<FollowActiveIcon className={icon} />}
          />
          <NavItem
            label="Chat"
            href={routes.chat}
            match={{ prefixes: [routes.chat, "/messages"] }}
            icon={<ChatIcon className={icon} />}
            activeIcon={<ChatActiveIcon className={icon} />}
          />
          <NavItem
            label="Grok"
            href={routes.grok}
            icon={<GrokIcon className={icon} />}
            activeIcon={<GrokActiveIcon className={icon} />}
          />
          <NavItem
            label="History"
            href={routes.history}
            match={{ prefixes: [routes.history, "/i/bookmarks"] }}
            icon={<HistoryIcon className={icon} />}
            activeIcon={<BookmarkActiveIcon className={icon} />}
          />
          <NavItem
            label="Creator Studio"
            href={routes.creatorStudio}
            match={{ prefixes: ["/i/jf/creators"] }}
            icon={<CreatorStudioIcon className={icon} />}
            activeIcon={<CreatorStudioActiveIcon className={icon} />}
          />
          <NavItem
            label="Premium"
            href={routes.premium}
            icon={<PremiumIcon className={icon} />}
            activeIcon={<VerifiedIcon className={icon} />}
          />
          <NavItem
            label="Profile"
            href={profile}
            match={{
              prefixes: [profile],
              exclude: [routes.lists(viewer.handle), routes.communities(viewer.handle)],
            }}
            icon={<ProfileIcon className={icon} />}
            activeIcon={<ProfileActiveIcon className={icon} />}
          />
          <MoreMenu handle={viewer.handle} />
        </nav>

        <Link
          href={routes.composePost}
          className={cn(buttonStyles({ size: "lg" }), "mt-4 w-[90%]")}
        >
          Post
        </Link>

        <AccountMenu handle={viewer.handle}>
          <Avatar src={viewer.avatarUrl} alt={viewer.displayName} />
          <span className="flex flex-col items-start">
            <span className="text-base font-bold">{viewer.displayName}</span>
            <span className="text-base text-muted">@{viewer.handle}</span>
          </span>
          <MoreHorizontalIcon className="ml-auto size-[18.75px]" />
        </AccountMenu>
      </div>
    </header>
  );
}
