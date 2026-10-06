import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { ProfilePostsPage } from "@/app/(app)/[handle]/_lib/profile-posts-page";
import { parseSort } from "@/app/(app)/[handle]/_lib/parse-sort";

async function All({ params, searchParams }: PageProps<"/[handle]/all">) {
  const [{ handle }, { sort }] = await Promise.all([params, searchParams]);

  return <ProfilePostsPage handle={handle} filter="all" sort={parseSort(sort)} />;
}

export default function ProfileAllPage(props: PageProps<"/[handle]/all">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <All {...props} />
    </Suspense>
  );
}
