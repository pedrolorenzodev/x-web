import { routes } from "@/config/routes";
import { getPinnedTweet } from "@/features/profile/api/get-pinned-tweet";
import { getProfileTweets } from "@/features/profile/api/get-profile-tweets";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { ProfileEmptyState } from "@/features/profile/components/profile-empty-state";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { ProfileTimeline } from "@/features/profile/components/profile-timeline";
import { WhoToFollowModule } from "@/features/profile/components/who-to-follow-module";
import type {
  ProfilePostsFilter,
  ProfileSort,
} from "@/features/profile/types/profile-tab";
import { profileAllPath } from "@/features/profile/utils/profile-paths";
import { loadProfile, tweetActions } from "@/app/(app)/[handle]/_lib/load-profile";

type ProfilePostsPageProps = {
  handle: string;
  filter: ProfilePostsFilter;
  sort: ProfileSort;
};

export async function ProfilePostsPage({
  handle,
  filter,
  sort,
}: ProfilePostsPageProps) {
  const loaded = await loadProfile(
    handle,
    filter === "all" ? profileAllPath : routes.profile,
  );
  if (!loaded) return <ProfileNotFound />;
  const { profile, isViewer, viewerId, postsVisible } = loaded;

  if (!postsVisible) {
    return (
      <ProfileScreen
        profile={profile}
        isViewer={isViewer}
        tab={filter}
        toggleFollow={toggleFollow}
      >
        {null}
      </ProfileScreen>
    );
  }

  const [firstPage, pinned, suggestions] = await Promise.all([
    getProfileTweets(profile.handle, filter, sort),
    getPinnedTweet(profile.handle),
    getSuggestedUsers(3, profile.id),
  ]);

  return (
    <ProfileScreen
      profile={profile}
      isViewer={isViewer}
      tab={filter}
      sort={sort}
      toggleFollow={toggleFollow}
    >
      <ProfileTimeline
        key={`${filter}-${sort}`}
        handle={profile.handle}
        source={{ kind: "posts", filter, sort }}
        firstPage={firstPage}
        pinned={pinned}
        actions={tweetActions}
        empty={
          isViewer ? null : (
            <ProfileEmptyState
              kind="posts"
              handle={profile.handle}
              isViewer={false}
            />
          )
        }
        module={
          suggestions.length > 0 ? (
            <WhoToFollowModule
              users={suggestions}
              viewerId={viewerId}
              similarToId={profile.id}
              toggleFollow={toggleFollow}
            />
          ) : null
        }
      />
    </ProfileScreen>
  );
}
