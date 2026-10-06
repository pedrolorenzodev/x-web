import { Suspense } from "react";
import { ViewerEditProfile } from "@/app/(app)/settings/profile/_components/viewer-edit-profile";

export default function InterceptedEditProfilePage() {
  return (
    <Suspense fallback={null}>
      <ViewerEditProfile intercepted />
    </Suspense>
  );
}
