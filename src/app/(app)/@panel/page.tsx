import { Suspense } from "react";
import { PanelTrends } from "@/app/(app)/@panel/_modules/panel-trends";
import { PanelNews } from "@/app/(app)/@panel/_modules/panel-news";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { PremiumCard } from "@/components/layout/right-panel/premium-card";
import { WhoToFollow } from "@/components/layout/right-panel/who-to-follow";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";
import { toggleFollow } from "@/features/profile/api/toggle-follow";

async function Suggestions() {
  const suggestions = await getSuggestedUsers();

  return <WhoToFollow suggestions={suggestions} toggleFollow={toggleFollow} />;
}

export default function HomePanel() {
  return (
    <RightPanel>
      <PremiumCard />
      <Suspense fallback={null}>
        <PanelNews />
      </Suspense>
      <Suspense fallback={null}>
        <PanelTrends />
      </Suspense>
      <Suspense fallback={null}>
        <Suggestions />
      </Suspense>
    </RightPanel>
  );
}
