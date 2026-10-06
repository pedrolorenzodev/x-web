import { Suspense } from "react";
import { ListUsersRoute } from "@/app/(app)/i/lists/[id]/_components/list-modal-routes";

export default function InterceptedListFollowersPage({
  params,
}: PageProps<"/i/lists/[id]/followers">) {
  return (
    <Suspense fallback={null}>
      <ListUsersRoute params={params} kind="followers" dismiss="back" />
    </Suspense>
  );
}
