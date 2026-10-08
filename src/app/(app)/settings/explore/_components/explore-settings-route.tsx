import type { RouteModalDismiss } from "@/hooks/use-route-modal-close";
import { getExploreSettings } from "@/features/explore/api/explore-settings";
import { ExploreSettingsModal } from "@/features/explore/components/explore-settings-modal";

export async function ExploreSettingsRoute({
  dismiss,
}: {
  dismiss: RouteModalDismiss;
}) {
  const settings = await getExploreSettings();
  return <ExploreSettingsModal initialSettings={settings} dismiss={dismiss} />;
}
