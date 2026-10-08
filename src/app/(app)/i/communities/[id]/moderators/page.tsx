import { MembersScreen } from "@/app/(app)/i/communities/[id]/_components/members-screen";
import { communityMetadata } from "@/app/(app)/i/communities/[id]/_components/community-metadata";

export function generateMetadata({
  params,
}: PageProps<"/i/communities/[id]/moderators">) {
  return communityMetadata(params, " Moderators");
}

export default function CommunityModeratorsPage({
  params,
}: PageProps<"/i/communities/[id]/moderators">) {
  return <MembersScreen params={params} tab="moderators" />;
}
