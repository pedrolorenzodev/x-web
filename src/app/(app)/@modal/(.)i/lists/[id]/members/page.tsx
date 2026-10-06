import { Suspense } from "react";
import { ListUsersRoute } from "@/app/(app)/i/lists/[id]/_components/list-modal-routes";

export default function InterceptedListMembersPage({
  params,
}: PageProps<"/i/lists/[id]/members">) {
  return (
    <Suspense fallback={null}>
      <ListUsersRoute params={params} kind="members" dismiss="back" />
    </Suspense>
  );
}
