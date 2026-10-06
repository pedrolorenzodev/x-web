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
}: PageProps<"/[handle]/followers">): Promise<Metadata> {
  const { handle } = await params;
  const profile = await getProfile(handle);
  return { title: followListTitle("followers", profile) };
}

async function Followers({
  params,
}: Pick<PageProps<"/[handle]/followers">, "params">) {
  const [{ handle }, session] = await Promise.all([params, getSession()]);
  if (!session) notFound();

  return <FollowListScreen handle={handle} kind="followers" />;
}

export default function FollowersPage({
  params,
}: PageProps<"/[handle]/followers">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Followers params={params} />
    </Suspense>
  );
}
