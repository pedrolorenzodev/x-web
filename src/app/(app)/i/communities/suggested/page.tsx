import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { getCommunities } from "@/features/communities/api/get-communities";
import { DiscoverCommunities } from "@/features/communities/components/discover-communities";

export const metadata: Metadata = {
  title: "Discover Communities / X",
};

async function SuggestedCommunities() {
  const communities = await getCommunities();
  return <DiscoverCommunities communities={communities} />;
}

export default function SuggestedCommunitiesPage() {
  return (
    <div className="pb-[200px]">
      <Suspense fallback={<SpinnerRow />}>
        <SuggestedCommunities />
      </Suspense>
    </div>
  );
}
