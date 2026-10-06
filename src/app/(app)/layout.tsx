import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Sidebar } from "@/components/layout/sidebar";
import { UserCardProvider } from "@/components/user/user-card-context";
import { TweetServicesProvider } from "@/components/tweet/tweet-services-context";
import { getProfile } from "@/features/profile/api/get-profile";
import { deleteTweet } from "@/features/tweet/api/delete-tweet";
import { togglePinTweet } from "@/features/tweet/api/toggle-pin-tweet";
import { getUserCard } from "@/features/profile/api/get-user-card";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { getSession } from "@/features/auth/api/get-session";
import { routes } from "@/config/routes";
import { getUnreadNotificationCount } from "@/features/notifications/api/get-unread-notification-count";
import { SearchServicesProvider } from "@/components/search/search-services-context";
import { getTypeahead } from "@/features/search/api/get-typeahead";
import {
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
  saveRecentQuery,
  saveRecentUser,
} from "@/features/search/api/recent-searches";

export const instant = false;

export default async function AppLayout({
  children,
  modal,
  panel,
}: LayoutProps<"/">) {
  const [session, unreadNotifications] = await Promise.all([
    getSession(),
    getUnreadNotificationCount(),
  ]);
  if (!session) redirect(routes.expiredSession);
  const viewer = await getProfile(session.user.handle);

  return (
    <UserCardProvider
      viewerId={session.user.id}
      loadUserCard={getUserCard}
      toggleFollow={toggleFollow}
    >
      <TweetServicesProvider
        pinnedTweetId={viewer?.pinnedTweetId ?? null}
        deleteTweet={deleteTweet}
        togglePinTweet={togglePinTweet}
      >
      <SearchServicesProvider
        getTypeahead={getTypeahead}
        getRecentSearches={getRecentSearches}
        saveRecentQuery={saveRecentQuery}
        saveRecentUser={saveRecentUser}
        removeRecentSearch={removeRecentSearch}
        clearRecentSearches={clearRecentSearches}
      >
      <AppShell
        sidebar={
          <Sidebar
            viewer={session.user}
            unreadNotifications={unreadNotifications}
          />
        }
        panel={panel}
        modal={modal}
      >
        {children}
      </AppShell>
      </SearchServicesProvider>
      </TweetServicesProvider>
    </UserCardProvider>
  );
}
