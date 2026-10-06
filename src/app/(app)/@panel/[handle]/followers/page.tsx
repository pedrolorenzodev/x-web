import { Suspense } from "react";
import { PanelTrends } from "@/app/(app)/@panel/_modules/panel-trends";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { WhoToFollow } from "@/components/layout/right-panel/who-to-follow";
import { getSession } from "@/features/auth/api/get-session";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";
import { toggleFollow } from "@/features/profile/api/toggle-follow";

async function Suggestions() {
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

export default function FollowListPanel() {
  return (
    <RightPanel>
      <Suspense fallback={null}>
        <PanelTrends />
      </Suspense>
      <Suspense fallback={null}>
        <Suggestions />
      </Suspense>
    </RightPanel>
  );
}
