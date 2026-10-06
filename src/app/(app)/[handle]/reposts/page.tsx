import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { routes } from "@/config/routes";
import { getProfileReposts } from "@/features/profile/api/get-profile-reposts";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { ProfileEmptyState } from "@/features/profile/components/profile-empty-state";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { ProfileTimeline } from "@/features/profile/components/profile-timeline";
import { loadProfile, tweetActions } from "@/app/(app)/[handle]/_lib/load-profile";

async function Reposts({ params }: PageProps<"/[handle]/reposts">) {
  const { handle } = await params;
  const loaded = await loadProfile(handle, routes.profileReposts);
  if (!loaded) return <ProfileNotFound />;
  const { profile, isViewer, postsVisible } = loaded;
  const firstPage = postsVisible ? await getProfileReposts(profile.handle) : null;

  return (
    <ProfileScreen
      profile={profile}
      isViewer={isViewer}
      tab="reposts"
      toggleFollow={toggleFollow}
    >
      {firstPage ? (
        <ProfileTimeline
          handle={profile.handle}
          source={{ kind: "reposts" }}
          firstPage={firstPage}
          actions={tweetActions}
          empty={
            <ProfileEmptyState
              kind="reposts"
              handle={profile.handle}
              isViewer={isViewer}
            />
          }
        />
      ) : null}
    </ProfileScreen>
  );
}

export default function ProfileRepostsPage(
  props: PageProps<"/[handle]/reposts">,
) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Reposts {...props} />
    </Suspense>
  );
}
