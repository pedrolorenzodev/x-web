import { Suspense } from "react";
import { PanelTrends } from "@/app/(app)/@panel/_modules/panel-trends";
import { PanelWhoToFollow } from "@/app/(app)/@panel/_modules/panel-who-to-follow";
import { RightPanel } from "@/components/layout/right-panel/right-panel";

export default function NotificationsPanel() {
  return (
    <RightPanel>
      <Suspense fallback={null}>
        <PanelTrends />
      </Suspense>
      <Suspense fallback={null}>
        <PanelWhoToFollow />
      </Suspense>
    </RightPanel>
  );
}
