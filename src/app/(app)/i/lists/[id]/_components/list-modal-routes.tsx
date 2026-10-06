import type { RouteModalDismiss } from "@/hooks/use-route-modal-close";
import { getSession } from "@/features/auth/api/get-session";
import { toggleFollow } from "@/features/profile/api/toggle-follow";
import { getList } from "@/features/lists/api/get-list";
import {
  getListFollowers,
  getListMembers,
} from "@/features/lists/api/get-list-members";
import { EditListModal } from "@/features/lists/components/edit-list-modal";
import { ListUsersModal } from "@/features/lists/components/list-users-modal";

type ListModalRouteProps = {
  params: Promise<{ id: string }>;
  dismiss: RouteModalDismiss;
};

export async function EditListRoute({ params, dismiss }: ListModalRouteProps) {
  const { id } = await params;
  const [list, session] = await Promise.all([getList(id), getSession()]);
  if (!list || list.owner.id !== session?.user.id) return null;

  return <EditListModal key={list.id} list={list} dismiss={dismiss} />;
}

export async function ListUsersRoute({
  params,
  kind,
  dismiss,
}: ListModalRouteProps & { kind: "members" | "followers" }) {
  const { id } = await params;
  const [list, users, session] = await Promise.all([
    getList(id),
    kind === "members" ? getListMembers(id) : getListFollowers(id),
    getSession(),
  ]);
  if (!list || !users || !session) return null;

  return (
    <ListUsersModal
      listId={list.id}
      kind={kind}
      users={users}
      viewerId={session.user.id}
      canRemove={kind === "members" && list.owner.id === session.user.id}
      toggleFollow={toggleFollow}
      dismiss={dismiss}
    />
  );
}
