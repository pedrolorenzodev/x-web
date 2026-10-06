import type { RouteModalDismiss } from "@/hooks/use-route-modal-close";
import { getListCandidates } from "@/features/lists/api/get-list-candidates";
import { CreateListModal } from "@/features/lists/components/create-list-modal";

export async function CreateListRoute({ dismiss }: { dismiss: RouteModalDismiss }) {
  const suggestions = await getListCandidates("");
  return <CreateListModal suggestions={suggestions} dismiss={dismiss} />;
}
