import { Suspense } from "react";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { SpinnerRow } from "@/components/ui/spinner";
import ProfilePage from "@/app/(app)/[handle]/page";
import { ProfileMediaViewer } from "@/app/(app)/[handle]/photo/_components/profile-media-viewer";
import { getProfile } from "@/features/profile/api/get-profile";

type ProfileMediaPageProps = PageProps<"/[handle]"> & {
  kind: "avatar" | "banner";
};

async function CanonicalProfile({
  params,
  searchParams,
  kind,
}: ProfileMediaPageProps) {
  const { handle } = await params;
  const profile = await getProfile(handle);
  if (profile && profile.handle !== handle) {
    redirect(
      kind === "avatar"
        ? routes.profilePhoto(profile.handle)
        : routes.profileHeaderPhoto(profile.handle),
    );
  }

  return (
    <>
      <ProfilePage params={params} searchParams={searchParams} />
      <Suspense fallback={null}>
        <ProfileMediaViewer params={params} kind={kind} intercepted={false} />
      </Suspense>
    </>
  );
}

export function ProfileMediaPage(props: ProfileMediaPageProps) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <CanonicalProfile {...props} />
    </Suspense>
  );
}
