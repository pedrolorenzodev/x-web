import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { FollowListScreen } from "@/features/profile/components/follow-list-screen";
import { followListTitle } from "@/features/profile/utils/follow-list";

export async function generateMetadata({
  params,
}: PageProps<"/[handle]/following">): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfile(handle);
  return { title: followListTitle("following", profile) };
}

async function Following({
  params,
}: Pick<PageProps<"/[handle]/following">, "params">) {
  const [{ handle }, session] = await Promise.all([params, getSession()]);
  if (!session) notFound();

  return <FollowListScreen handle={handle} kind="following" />;
}

export default function FollowingPage({
  params,
}: PageProps<"/[handle]/following">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Following params={params} />
    </Suspense>
  );
}
