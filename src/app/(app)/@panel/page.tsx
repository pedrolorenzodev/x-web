import { Suspense } from "react";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { NewsCard } from "@/components/layout/right-panel/news-card";
import { PremiumCard } from "@/components/layout/right-panel/premium-card";
import { TrendsCard } from "@/components/layout/right-panel/trends-card";
import { WhoToFollow } from "@/components/layout/right-panel/who-to-follow";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";

async function Suggestions() {
  const suggestions = await getSuggestedUsers();

  return <WhoToFollow suggestions={suggestions} />;
}

export default function HomePanel() {
  return (
    <RightPanel>
      <PremiumCard />
      <NewsCard />
      <TrendsCard />
      <Suspense fallback={null}>
        <Suggestions />
      </Suspense>
    </RightPanel>
  );
}
