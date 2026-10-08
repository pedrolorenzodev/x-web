import Link from "next/link";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { SidebarTooltip } from "@/components/layout/sidebar-tooltip";
import { cn } from "@/lib/utils";
import { NavItem } from "@/components/layout/nav-item";
import { MoreMenu } from "@/components/layout/more-menu";
import { AccountMenu } from "@/components/layout/account-menu";
import {
  collapsedOnly,
  expandedOnly,
  sidebarAlign,
  sidebarGutter,
  sidebarWidth,
} from "@/components/layout/sidebar-styles";
import {
  BookmarkActiveIcon,
  ComposeIcon,
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
    <header className={cn("shrink-0 max-[499px]:hidden", sidebarWidth)}>
      <div
        className={cn(
          "fixed top-0 flex h-screen flex-col [scrollbar-width:none] [@media(max-height:800px)]:overflow-y-auto",
          sidebarWidth,
          sidebarGutter,
          sidebarAlign,
        )}
      >
        <Link
          href={routes.home}
          aria-label="X"
          className="mt-0.5 flex size-13 items-center justify-center rounded-full transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
        >
          <XLogoIcon className="size-[30px]" />
        </Link>

        <nav aria-label="Primary" className="mt-1 flex w-full flex-col">
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
            match={{ prefixes: [routes.chat, "/messages"], exclude: [routes.chatShare] }}
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

        <SidebarTooltip label="Post">
          <Link
            href={routes.composePost}
            aria-label="Post"
            className="mt-5 flex size-13 items-center justify-center rounded-full bg-inverted text-inverted-foreground transition-colors duration-200 hover:bg-inverted/90 min-[1265px]:w-[90%] layout-fullwidth:w-13!"
          >
            <ComposeIcon className={cn("size-6", collapsedOnly)} />
            <span data-nav-label className={cn("text-lg font-bold", expandedOnly)}>
              Post
            </span>
          </Link>
        </SidebarTooltip>

        <AccountMenu handle={viewer.handle}>
          <Avatar src={viewer.avatarUrl} alt={viewer.displayName} />
          <span className={cn("flex-col items-start", expandedOnly, "min-[1265px]:flex")}>
            <span className="text-base font-bold">{viewer.displayName}</span>
            <span className="text-base text-muted">@{viewer.handle}</span>
          </span>
          <MoreHorizontalIcon
            className={cn("ml-auto size-[18.75px]", expandedOnly)}
          />
        </AccountMenu>
      </div>
    </header>
  );
}
