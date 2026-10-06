import type { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/config/routes";
import { ListScreen } from "@/app/(app)/i/lists/[id]/_components/list-screen";
import { ListUsersRoute } from "@/app/(app)/i/lists/[id]/_components/list-modal-routes";

export const metadata: Metadata = {
  title: "List followers / X",
};

async function FollowersOverScreen({
  params,
}: Pick<PageProps<"/i/lists/[id]/followers">, "params">) {
  const { id } = await params;
  return (
    <ListUsersRoute
      params={params}
      kind="followers"
      dismiss={{ replace: routes.list(id) }}
    />
  );
}

export default function ListFollowersPage({
  params,
}: PageProps<"/i/lists/[id]/followers">) {
  return (
    <>
      <ListScreen params={params} />
      <Suspense fallback={null}>
        <FollowersOverScreen params={params} />
      </Suspense>
    </>
  );
}
