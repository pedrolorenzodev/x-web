import type { ReactNode } from "react";
import type { ToggleFollow, User } from "@/types/user";
import { ProfileAppBar } from "@/features/profile/components/profile-app-bar";
import { ProtectedPostsState } from "@/features/profile/components/profile-empty-state";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { ProfileTabs } from "@/features/profile/components/profile-tabs";
import type {
  ProfileMediaFilter,
  ProfileSort,
  ProfileTab,
} from "@/features/profile/types/profile-tab";
import { canViewPosts } from "@/features/profile/utils/can-view-posts";

type ProfileScreenProps = {
  profile: User;
  isViewer: boolean;
  tab: ProfileTab;
  sort?: ProfileSort;
  mediaFilter?: ProfileMediaFilter;
  toggleFollow: ToggleFollow;
  children: ReactNode;
};

export function ProfileScreen({
  profile,
  isViewer,
  tab,
  sort = "recent",
  mediaFilter = "video",
  toggleFollow,
  children,
}: ProfileScreenProps) {
  const visible = canViewPosts(profile, isViewer);

  return (
    <>
      <ProfileAppBar
        profile={profile}
        isViewer={isViewer}
        media={visible && tab === "media"}
      />
      <ProfileHeader
        profile={profile}
        isViewer={isViewer}
        toggleFollow={toggleFollow}
      />
      {visible ? (
        <>
          <ProfileTabs
            handle={profile.handle}
            active={tab}
            sort={sort}
            mediaFilter={mediaFilter}
          />
          <div className="pb-[200px]">{children}</div>
        </>
      ) : (
        <ProtectedPostsState handle={profile.handle} />
      )}
    </>
  );
}
