import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { EditProfileModal } from "@/features/profile/components/edit-profile-modal";

export async function ViewerEditProfile({
  intercepted,
}: {
  intercepted: boolean;
}) {
  const session = await getSession();
  if (!session) redirect(routes.expiredSession);

  const profile = await getProfile(session.user.handle);
  if (!profile) return null;

  return (
    <EditProfileModal
      profile={profile}
      dismiss={intercepted ? "back" : { replace: routes.profile(profile.handle) }}
    />
  );
}
