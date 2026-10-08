import type { RouteModalDismiss } from "@/hooks/use-route-modal-close";
import { getSearchSettings } from "@/features/search/api/search-settings";
import { SearchSettingsModal } from "@/features/search/components/search-settings-modal";

export async function SearchSettingsRoute({
  dismiss,
}: {
  dismiss: RouteModalDismiss;
}) {
  const settings = await getSearchSettings();
  return <SearchSettingsModal initialSettings={settings} dismiss={dismiss} />;
}
