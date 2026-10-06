import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { ProfilePostsPage } from "@/app/(app)/[handle]/_lib/profile-posts-page";
import { parseSort } from "@/app/(app)/[handle]/_lib/parse-sort";

async function Posts({ params, searchParams }: PageProps<"/[handle]">) {
  const [{ handle }, { sort }] = await Promise.all([params, searchParams]);

  return <ProfilePostsPage handle={handle} filter="posts" sort={parseSort(sort)} />;
}

export default function ProfilePage(props: PageProps<"/[handle]">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Posts {...props} />
    </Suspense>
  );
}
