import { MembersScreen } from "@/app/(app)/i/communities/[id]/_components/members-screen";
import { communityMetadata } from "@/app/(app)/i/communities/[id]/_components/community-metadata";

export function generateMetadata({
  params,
}: PageProps<"/i/communities/[id]/members">) {
  return communityMetadata(params, " Members");
}

export default function CommunityMembersPage({
  params,
}: PageProps<"/i/communities/[id]/members">) {
  return <MembersScreen params={params} tab="all" />;
}
