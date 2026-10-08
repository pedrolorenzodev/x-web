import { Suspense } from "react";
import { PanelTrends } from "@/app/(app)/@panel/_modules/panel-trends";
import { PanelNews } from "@/app/(app)/@panel/_modules/panel-news";
import { PanelWhoToFollow } from "@/app/(app)/@panel/_modules/panel-who-to-follow";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { PremiumCard } from "@/components/layout/right-panel/premium-card";

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
        <PanelWhoToFollow />
      </Suspense>
    </RightPanel>
  );
}
