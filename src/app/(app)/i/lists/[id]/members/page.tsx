import type { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/config/routes";
import { ListScreen } from "@/app/(app)/i/lists/[id]/_components/list-screen";
import { ListUsersRoute } from "@/app/(app)/i/lists/[id]/_components/list-modal-routes";

export const metadata: Metadata = {
  title: "List members / X",
};

async function MembersOverScreen({
  params,
}: Pick<PageProps<"/i/lists/[id]/members">, "params">) {
  const { id } = await params;
  return (
    <ListUsersRoute
      params={params}
      kind="members"
      dismiss={{ replace: routes.list(id) }}
    />
  );
}

export default function ListMembersPage({
  params,
}: PageProps<"/i/lists/[id]/members">) {
  return (
    <>
      <ListScreen params={params} />
      <Suspense fallback={null}>
        <MembersOverScreen params={params} />
      </Suspense>
    </>
  );
}
