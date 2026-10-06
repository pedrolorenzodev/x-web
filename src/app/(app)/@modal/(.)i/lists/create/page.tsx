import { Suspense } from "react";
import { CreateListRoute } from "@/app/(app)/i/lists/_components/create-list-route";

export default function InterceptedCreateListPage() {
  return (
    <Suspense fallback={null}>
      <CreateListRoute dismiss="back" />
    </Suspense>
  );
}
