import { ProfileMediaPage } from "@/app/(app)/[handle]/photo/_components/profile-media-page";

export default function ProfileHeaderPhotoPage(
  props: PageProps<"/[handle]/header_photo">,
) {
  return <ProfileMediaPage {...props} kind="banner" />;
}
