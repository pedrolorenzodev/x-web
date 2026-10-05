import { Suspense } from "react";
import { PanelTrends } from "@/app/(app)/@panel/_modules/panel-trends";
import { RightPanel } from "@/components/layout/right-panel/right-panel";
import { WhoToFollow } from "@/components/layout/right-panel/who-to-follow";
import { getProfile } from "@/features/profile/api/get-profile";
import { getSuggestedUsers } from "@/features/profile/api/get-suggested-users";
import { toggleFollow } from "@/features/profile/api/toggle-follow";

async function YouMightLike({
  params,
}: {
  params: PageProps<"/[handle]">["params"];
}) {
  const { handle } = await params;
  const profile = await getProfile(handle);
  const suggestions = await getSuggestedUsers(3, profile?.id ?? null);

  return (
    <WhoToFollow
      suggestions={suggestions}
      toggleFollow={toggleFollow}
      title="You might like"
    />
  );
}

export default function ProfilePanel({ params }: PageProps<"/[handle]">) {
  return (
    <RightPanel>
      <Suspense fallback={null}>
        <YouMightLike params={params} />
      </Suspense>
      <Suspense fallback={null}>
        <PanelTrends />
      </Suspense>
    </RightPanel>
  );
}
