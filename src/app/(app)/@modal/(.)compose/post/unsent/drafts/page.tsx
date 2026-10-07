import { Suspense } from "react";
import { DraftsRoute } from "@/app/(app)/compose/post/unsent/_components/drafts-route";

export default function InterceptedDraftsPage() {
  return (
    <Suspense fallback={null}>
      <DraftsRoute tab="drafts" dismiss="back" />
    </Suspense>
  );
}
