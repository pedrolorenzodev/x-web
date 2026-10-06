import { Suspense } from "react";
import { EditListRoute } from "@/app/(app)/i/lists/[id]/_components/list-modal-routes";

export default function InterceptedEditListPage({
  params,
}: PageProps<"/i/lists/[id]/info">) {
  return (
    <Suspense fallback={null}>
      <EditListRoute params={params} dismiss="back" />
    </Suspense>
  );
}
