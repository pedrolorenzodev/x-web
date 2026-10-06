import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { routes } from "@/config/routes";
import {
  getProfilePhotos,
  getProfileVideos,
} from "@/features/profile/api/get-profile-media";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { ProfileEmptyState } from "@/features/profile/components/profile-empty-state";
import { ProfileNotFound } from "@/features/profile/components/profile-not-found";
import { ProfilePhotoGrid } from "@/features/profile/components/profile-photo-grid";
import { ProfileScreen } from "@/features/profile/components/profile-screen";
import { ProfileTimeline } from "@/features/profile/components/profile-timeline";
import { loadProfile, tweetActions } from "@/app/(app)/[handle]/_lib/load-profile";

async function MediaContent({
  handle,
  isViewer,
  filter,
}: {
  handle: string;
  isViewer: boolean;
  filter: "photo" | "video";
}) {
  if (filter === "photo") {
    const firstPage = await getProfilePhotos(handle);
    return (
      <ProfilePhotoGrid
        handle={handle}
        firstPage={firstPage}
        empty={
          <ProfileEmptyState kind="photos" handle={handle} isViewer={isViewer} />
        }
      />
    );
  }

  const firstPage = await getProfileVideos(handle);
  return (
    <ProfileTimeline
      handle={handle}
      source={{ kind: "videos" }}
      firstPage={firstPage}
      actions={tweetActions}
      empty={
        <ProfileEmptyState kind="videos" handle={handle} isViewer={isViewer} />
      }
    />
  );
}

async function Media({ params, searchParams }: PageProps<"/[handle]/media">) {
  const [{ handle }, query] = await Promise.all([params, searchParams]);
  const filter = query.filter === "photo" ? "photo" : "video";
  const loaded = await loadProfile(handle, routes.profileMedia);
  if (!loaded) return <ProfileNotFound />;
  const { profile, isViewer, postsVisible } = loaded;

  return (
    <ProfileScreen
      profile={profile}
      isViewer={isViewer}
      tab="media"
      mediaFilter={filter}
      toggleFollow={toggleFollow}
    >
      {postsVisible ? (
        <MediaContent
          key={filter}
          handle={profile.handle}
          isViewer={isViewer}
          filter={filter}
        />
      ) : null}
    </ProfileScreen>
  );
}

export default function ProfileMediaPage(props: PageProps<"/[handle]/media">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Media {...props} />
    </Suspense>
  );
}
