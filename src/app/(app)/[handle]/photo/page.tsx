import { ProfileMediaPage } from "@/app/(app)/[handle]/photo/_components/profile-media-page";

export default function ProfilePhotoPage(props: PageProps<"/[handle]/photo">) {
  return <ProfileMediaPage {...props} kind="avatar" />;
}
