import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { routes } from "@/config/routes";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { ProfileEmptyState } from "@/features/profile/components/profile-empty-state";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { loadProfile } from "@/app/(app)/[handle]/_lib/load-profile";

async function Highlights({ params }: PageProps<"/[handle]/highlights">) {
  const { handle } = await params;
  const loaded = await loadProfile(handle, routes.profileHighlights);
  if (!loaded) return <ProfileNotFound />;
  const { profile, isViewer } = loaded;

  return (
    <ProfileScreen
      profile={profile}
      isViewer={isViewer}
      tab="highlights"
      toggleFollow={toggleFollow}
    >
      <ProfileEmptyState
        kind="highlights"
        handle={profile.handle}
        isViewer={isViewer}
      />
    </ProfileScreen>
  );
}

export default function ProfileHighlightsPage(
  props: PageProps<"/[handle]/highlights">,
) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Highlights {...props} />
    </Suspense>
  );
}
