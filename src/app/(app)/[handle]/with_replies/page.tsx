import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { routes } from "@/config/routes";
import { getProfileReplies } from "@/features/profile/api/get-profile-replies";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { ProfileEmptyState } from "@/features/profile/components/profile-empty-state";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import { ProfileReplies } from "@/features/profile/components/profile-replies";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { loadProfile, tweetActions } from "@/app/(app)/[handle]/_lib/load-profile";

async function Replies({ params }: PageProps<"/[handle]/with_replies">) {
  const { handle } = await params;
  const loaded = await loadProfile(handle, routes.profileReplies);
  if (!loaded) return <ProfileNotFound />;
  const { profile, isViewer, postsVisible } = loaded;
  const firstPage = postsVisible ? await getProfileReplies(profile.handle) : null;

  return (
    <ProfileScreen
      profile={profile}
      isViewer={isViewer}
      tab="replies"
      toggleFollow={toggleFollow}
    >
      {firstPage ? (
        <ProfileReplies
          handle={profile.handle}
          firstPage={firstPage}
          actions={tweetActions}
          empty={
            <ProfileEmptyState
              kind="replies"
              handle={profile.handle}
              isViewer={isViewer}
            />
          }
        />
      ) : null}
    </ProfileScreen>
  );
}

export default function ProfileRepliesPage(
  props: PageProps<"/[handle]/with_replies">,
) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Replies {...props} />
    </Suspense>
  );
}
