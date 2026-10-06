import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SpinnerRow } from "@/components/ui/spinner";
import { getDiscoverLists } from "@/features/lists/api/get-discover-lists";
import { DiscoverListsSection } from "@/features/lists/components/lists-sections";
import { SuggestedListsHero } from "@/features/lists/components/suggested-lists-hero";

export const metadata: Metadata = {
  title: "Suggested Lists / X",
};

const SUGGESTED_LIMIT = 20;

async function SuggestedLists() {
  const lists = await getDiscoverLists(SUGGESTED_LIMIT);
  return <DiscoverListsSection lists={lists} showMore={false} />;
}

export default function SuggestedListsPage() {
  return (
    <div className="pb-16">
      <PageHeader title="Suggested Lists" />
      <SuggestedListsHero />
      <Suspense fallback={<SpinnerRow />}>
        <SuggestedLists />
      </Suspense>
    </div>
  );
}
