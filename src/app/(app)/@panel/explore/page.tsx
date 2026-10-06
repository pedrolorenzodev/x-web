import { Suspense } from "react";
import { PanelNews } from "@/app/(app)/@panel/_modules/panel-news";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { WhoToFollow } from "@/components/layout/right-panel/who-to-follow";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { getSession } from "@/features/auth/api/get-session";

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

export default function ExplorePanel() {
  return (
    <RightPanel search={false}>
      <Suspense fallback={null}>
        <PanelNews />
      </Suspense>
      <Suspense fallback={null}>
        <Suggestions />
      </Suspense>
    </RightPanel>
  );
}
