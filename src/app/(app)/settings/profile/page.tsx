import { Suspense } from "react";
import ProfilePage from "@/app/(app)/[handle]/page";
import { ViewerEditProfile } from "@/app/(app)/settings/profile/_components/viewer-edit-profile";
import { viewerProfileParams } from "@/app/(app)/settings/profile/_components/viewer-profile-params";

export default function EditProfilePage({
  searchParams,
}: PageProps<"/settings/profile">) {
  return (
    <>
      <ProfilePage params={viewerProfileParams()} searchParams={searchParams} />
      <Suspense fallback={null}>
        <ViewerEditProfile intercepted={false} />
      </Suspense>
    </>
  );
}
