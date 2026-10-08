import { CommunityScreen } from "@/app/(app)/i/communities/[id]/_components/community-screen";
import { communityMetadata } from "@/app/(app)/i/communities/[id]/_components/community-metadata";

export function generateMetadata({
  params,
}: PageProps<"/i/communities/[id]/about">) {
  return communityMetadata(params);
}

export default function CommunityAboutPage({
  params,
}: PageProps<"/i/communities/[id]/about">) {
  return <CommunityScreen params={params} tab="about" />;
}
