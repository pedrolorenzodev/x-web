import type { DraftsTab } from "@/types/draft";
import type { RouteModalDismiss } from "@/hooks/use-route-modal-close";
import { getDrafts } from "@/features/compose/api/get-drafts";
import { DraftsModal } from "@/features/compose/components/drafts-modal";

type DraftsRouteProps = {
  tab: DraftsTab;
  dismiss: RouteModalDismiss;
};

export async function DraftsRoute({ tab, dismiss }: DraftsRouteProps) {
  const drafts = await getDrafts(tab);
  return <DraftsModal key={tab} tab={tab} drafts={drafts} dismiss={dismiss} />;
}
