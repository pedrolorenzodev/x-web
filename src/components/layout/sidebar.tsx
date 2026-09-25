import Link from "next/link";
import type { UserSummary } from "@/types/user";
import { routes } from "@/config/routes";
import { Avatar } from "@/components/ui/avatar";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavItem } from "@/components/layout/nav-item";
import {
  ChatIcon,
  CreatorStudioIcon,
  ExploreIcon,
  FollowIcon,
  GrokIcon,
  HistoryIcon,
  HomeActiveIcon,
  HomeIcon,
  MoreHorizontalIcon,
  MoreIcon,
  NotificationsIcon,
  PremiumIcon,
  ProfileActiveIcon,
  ProfileIcon,
  XLogoIcon,
} from "@/components/ui/icons";

type SidebarProps = {
  viewer: UserSummary;
};

const icon = "size-[26.25px]";

const inertItems = [
  { label: "Explore", icon: <ExploreIcon className={icon} /> },
  { label: "Notifications", icon: <NotificationsIcon className={icon} /> },
  { label: "Follow", icon: <FollowIcon className={icon} /> },
  { label: "Chat", icon: <ChatIcon className={icon} /> },
  { label: "Grok", icon: <GrokIcon className={icon} /> },
  { label: "History", icon: <HistoryIcon className={icon} /> },
  { label: "Creator Studio", icon: <CreatorStudioIcon className={icon} /> },
  { label: "Premium", icon: <PremiumIcon className={icon} /> },
];

export function Sidebar({ viewer }: SidebarProps) {
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

        <nav className="mt-1 flex flex-col">
          <NavItem
            label="Home"
            href={routes.home}
            icon={<HomeIcon className={icon} />}
            activeIcon={<HomeActiveIcon className={icon} />}
          />
          {inertItems.map((item) => (
            <NavItem key={item.label} label={item.label} icon={item.icon} />
          ))}
          <NavItem
            label="Profile"
            href={routes.profile(viewer.handle)}
            icon={<ProfileIcon className={icon} />}
            activeIcon={<ProfileActiveIcon className={icon} />}
          />
          <NavItem label="More" icon={<MoreIcon className={icon} />} />
        </nav>

        <Link
          href={routes.composePost}
          className={cn(buttonStyles({ size: "lg" }), "mt-2 w-[90%]")}
        >
          Post
        </Link>

        <button
          type="button"
          className="mt-auto mb-3 flex w-full items-center gap-3 rounded-full p-3 transition-colors duration-200 ease-[ease] hover:bg-foreground/10"
        >
          <Avatar src={viewer.avatarUrl} alt={viewer.displayName} />
          <span className="flex flex-col items-start">
            <span className="text-base font-bold">{viewer.displayName}</span>
            <span className="text-base text-muted">@{viewer.handle}</span>
          </span>
          <MoreHorizontalIcon className="ml-auto size-[18.75px]" />
        </button>
      </div>
    </header>
  );
}
