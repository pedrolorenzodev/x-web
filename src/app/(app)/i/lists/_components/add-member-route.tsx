import type { RouteModalDismiss } from "@/hooks/use-route-modal-close";
import { getPickableLists } from "@/features/lists/api/get-pickable-lists";
import { PickListModal } from "@/features/lists/components/pick-list-modal";

type AddMemberRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  dismiss: RouteModalDismiss;
};

export async function AddMemberRoute({ searchParams, dismiss }: AddMemberRouteProps) {
  const { user_id: userId } = await searchParams;
  if (typeof userId !== "string") return null;
  const lists = await getPickableLists(userId);
  if (!lists) return null;

  return (
    <PickListModal
      key={userId}
      userId={userId}
      lists={lists}
      dismiss={dismiss}
    />
  );
}
