import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { SpinnerRow } from "@/components/ui/spinner";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { getDiscoverLists } from "@/features/lists/api/get-discover-lists";
import { getLists } from "@/features/lists/api/get-lists";
import { ListsHeader } from "@/features/lists/components/lists-header";
import {
  DiscoverListsSection,
  UserListsSection,
  YourListsSection,
} from "@/features/lists/components/lists-sections";

export const metadata: Metadata = {
  title: "Lists / X",
};

async function Lists({ params }: Pick<PageProps<"/[handle]/lists">, "params">) {
  const { handle } = await params;
  const [session, profile] = await Promise.all([getSession(), getProfile(handle)]);
  if (!session || !profile) notFound();
  if (profile.handle !== handle) redirect(routes.lists(profile.handle));

  if (profile.id !== session.user.id) {
    const lists = await getLists(profile.handle);
    return (
      <>
        <PageHeader title="Lists" subtitle={`@${profile.handle}`} />
        <UserListsSection lists={lists} />
      </>
    );
  }

  const [discover, lists] = await Promise.all([
    getDiscoverLists(),
    getLists(profile.handle),
  ]);

  return (
    <>
      <ListsHeader handle={profile.handle} />
      <DiscoverListsSection lists={discover} />
      <YourListsSection lists={lists} />
    </>
  );
}

export default function ListsPage({ params }: PageProps<"/[handle]/lists">) {
  return (
    <div className="pb-16">
      <Suspense fallback={<SpinnerRow />}>
        <Lists params={params} />
      </Suspense>
    </div>
  );
}
