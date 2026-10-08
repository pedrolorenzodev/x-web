import { CommunityScreen } from "@/app/(app)/i/communities/[id]/_components/community-screen";
import { communityMetadata } from "@/app/(app)/i/communities/[id]/_components/community-metadata";

export function generateMetadata({ params }: PageProps<"/i/communities/[id]">) {
  return communityMetadata(params);
}

async function initialTab(
  searchParams: PageProps<"/i/communities/[id]">["searchParams"],
) {
  const { tab } = await searchParams;
  return tab === "latest" || tab === "media" ? tab : "top";
}

export default function CommunityPage({
  params,
  searchParams,
}: PageProps<"/i/communities/[id]">) {
  return <CommunityScreen params={params} tab={initialTab(searchParams)} />;
}
