import type { Metadata } from "next";
import { Suspense } from "react";
import { routes } from "@/config/routes";
import { ListScreen } from "@/app/(app)/i/lists/[id]/_components/list-screen";
import { EditListRoute } from "@/app/(app)/i/lists/[id]/_components/list-modal-routes";

export const metadata: Metadata = {
  title: "Edit List / X",
};

async function EditListOverScreen({
  params,
}: Pick<PageProps<"/i/lists/[id]/info">, "params">) {
  const { id } = await params;
  return <EditListRoute params={params} dismiss={{ replace: routes.list(id) }} />;
}

export default function EditListPage({ params }: PageProps<"/i/lists/[id]/info">) {
  return (
    <>
      <ListScreen params={params} />
      <Suspense fallback={null}>
        <EditListOverScreen params={params} />
      </Suspense>
    </>
  );
}
