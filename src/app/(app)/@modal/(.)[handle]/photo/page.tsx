import { Suspense } from "react";
import { ProfileMediaViewer } from "@/app/(app)/[handle]/photo/_components/profile-media-viewer";

export default function InterceptedProfilePhotoPage({
  params,
}: PageProps<"/[handle]/photo">) {
  return (
    <Suspense fallback={null}>
      <ProfileMediaViewer params={params} kind="avatar" intercepted />
    </Suspense>
  );
}
