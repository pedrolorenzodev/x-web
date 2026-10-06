import { Suspense } from "react";
import { ProfileMediaViewer } from "@/app/(app)/[handle]/photo/_components/profile-media-viewer";

export default function InterceptedProfileHeaderPhotoPage({
  params,
}: PageProps<"/[handle]/header_photo">) {
  return (
    <Suspense fallback={null}>
      <ProfileMediaViewer params={params} kind="banner" intercepted />
    </Suspense>
  );
}
