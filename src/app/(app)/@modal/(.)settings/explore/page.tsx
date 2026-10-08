import { Suspense } from "react";
import { ExploreSettingsRoute } from "@/app/(app)/settings/explore/_components/explore-settings-route";

export default function InterceptedExploreSettingsPage() {
  return (
    <Suspense fallback={null}>
      <ExploreSettingsRoute dismiss="back" />
    </Suspense>
  );
}
