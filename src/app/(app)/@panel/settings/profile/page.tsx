import ProfilePanel from "@/app/(app)/@panel/[handle]/page";
import { viewerProfileParams } from "@/app/(app)/settings/profile/_components/viewer-profile-params";

export default function EditProfilePanel({
  searchParams,
}: PageProps<"/settings/profile">) {
  return (
    <ProfilePanel params={viewerProfileParams()} searchParams={searchParams} />
  );
}
