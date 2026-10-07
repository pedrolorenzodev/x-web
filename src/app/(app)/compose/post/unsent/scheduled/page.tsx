import type { Metadata } from "next";
import { Suspense } from "react";
import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { DraftsRoute } from "@/app/(app)/compose/post/unsent/_components/drafts-route";

export const metadata: Metadata = {
  title: "Drafts / X",
};

export default function ScheduledPage() {
  return (
    <>
      <HomePage />
      <Suspense fallback={null}>
        <DraftsRoute tab="scheduled" dismiss={{ replace: routes.composePost }} />
      </Suspense>
    </>
  );
}
