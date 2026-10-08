import { WhoToFollow } from "@/components/layout/right-panel/who-to-follow";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { getSession } from "@/features/auth/api/get-session";

export async function PanelWhoToFollow() {
  const [suggestions, session] = await Promise.all([
    getSuggestedUsers(),
    getSession(),
  ]);

  return (
    <WhoToFollow
      suggestions={suggestions}
      toggleFollow={toggleFollow}
      similarToId={session?.user.id}
    />
  );
}
