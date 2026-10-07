import { Suspense } from "react";
import { DraftsRoute } from "@/app/(app)/compose/post/unsent/_components/drafts-route";

export default function InterceptedScheduledPage() {
  return (
    <Suspense fallback={null}>
      <DraftsRoute tab="scheduled" dismiss="back" />
    </Suspense>
  );
}
