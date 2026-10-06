import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { SpinnerRow } from "@/components/ui/spinner";
import { getSession } from "@/features/auth/api/get-session";
import { getProfile } from "@/features/profile/api/get-profile";
import { getListMemberships } from "@/features/lists/api/get-list-memberships";
import { ListCell } from "@/features/lists/components/list-cell";

export const metadata: Metadata = {
  title: "Lists / X",
};

async function Memberships({
  params,
}: Pick<PageProps<"/[handle]/lists/memberships">, "params">) {
  const { handle } = await params;
  const [session, profile] = await Promise.all([getSession(), getProfile(handle)]);
  if (!session || !profile) notFound();
  if (profile.handle !== handle) {
    redirect(`${routes.lists(profile.handle)}/memberships`);
  }
  const lists = await getListMemberships(profile.handle);
  const isViewer = profile.id === session.user.id;

  return (
    <>
      <PageHeader
        title={isViewer ? "Lists you’re on" : `Lists @${profile.handle} is on`}
        subtitle={`@${profile.handle}`}
      />
      {lists.length ? (
        lists.map((list) => (
          <ListCell
            key={list.id}
            list={list}
            social={list.followersPreview.length ? "followers" : "owner"}
            showMemberCount
          />
        ))
      ) : (
        <EmptyState
          title={
            isViewer
              ? "You haven’t been added to any Lists yet"
              : `@${profile.handle} hasn’t been added to any Lists yet`
          }
          body={
            isViewer
              ? "When someone adds you to a List, it’ll show up here."
              : "When someone adds them to a List, it’ll show up here."
          }
        />
      )}
    </>
  );
}

export default function MembershipsPage({
  params,
}: PageProps<"/[handle]/lists/memberships">) {
  return (
    <div className="pb-16">
      <Suspense fallback={<SpinnerRow />}>
        <Memberships params={params} />
      </Suspense>
    </div>
  );
}
