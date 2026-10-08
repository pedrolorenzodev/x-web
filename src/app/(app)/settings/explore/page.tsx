import { Suspense } from "react";
import ExploreLayout from "@/app/(app)/explore/layout";
import ExplorePage from "@/app/(app)/explore/page";
import { routes } from "@/config/routes";
import { ExploreSettingsRoute } from "@/app/(app)/settings/explore/_components/explore-settings-route";

export { metadata } from "@/app/(app)/explore/page";

export default function ExploreSettingsPage() {
  return (
    <>
      <ExploreLayout>
        <ExplorePage />
      </ExploreLayout>
      <Suspense fallback={null}>
        <ExploreSettingsRoute dismiss={{ replace: routes.explore }} />
      </Suspense>
    </>
  );
}
