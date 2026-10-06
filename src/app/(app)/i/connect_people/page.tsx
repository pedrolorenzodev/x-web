import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { getSession } from "@/features/auth/api/get-session";
import { getConnectPeople } from "@/features/connect/api/get-connect-people";
import { ConnectHeader } from "@/features/connect/components/connect-header";
import { ConnectPeople } from "@/features/connect/components/connect-people";
import { toConnectQuery } from "@/features/connect/utils/connect-query";
import { toggleFollow } from "@/features/profile/api/toggle-follow";

export const metadata: Metadata = {
  title: "Follow / X",
};

async function Connect({
  searchParams,
}: Pick<PageProps<"/i/connect_people">, "searchParams">) {
  const query = toConnectQuery(await searchParams);
  const [page, session] = await Promise.all([
    getConnectPeople(query),
    getSession(),
  ]);
  if (!session) notFound();

  return (
    <ConnectPeople
      page={page}
      viewerId={session.user.id}
      toggleFollow={toggleFollow}
    />
  );
}

export default function FollowPage({
  searchParams,
}: PageProps<"/i/connect_people">) {
  return (
    <Suspense
      fallback={
        <>
          <ConnectHeader />
          <SpinnerRow />
        </>
      }
    >
      <Connect searchParams={searchParams} />
    </Suspense>
  );
}
