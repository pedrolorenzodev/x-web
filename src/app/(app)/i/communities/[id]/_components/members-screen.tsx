import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { getSession } from "@/features/auth/api/get-session";
import { getCommunityMembers } from "@/features/communities/api/get-community-members";
import { CommunityMembers } from "@/features/communities/components/community-members";
import { toggleFollow } from "@/features/profile/api/toggle-follow";

async function MembersContent({
  params,
  tab,
}: {
  params: Promise<{ id: string }>;
  tab: "all" | "moderators";
}) {
  const { id } = await params;
  const [members, session] = await Promise.all([
    getCommunityMembers(id),
    getSession(),
  ]);
  if (!members || !session) notFound();

  return (
    <CommunityMembers
      communityId={id}
      tab={tab}
      members={members}
      viewerId={session.user.id}
      toggleFollow={toggleFollow}
    />
  );
}

export function MembersScreen({
  params,
  tab,
}: {
  params: Promise<{ id: string }>;
  tab: "all" | "moderators";
}) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <MembersContent params={params} tab={tab} />
    </Suspense>
  );
}
