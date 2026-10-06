import { Suspense } from "react";
import { AddMemberRoute } from "@/app/(app)/i/lists/_components/add-member-route";

export default function InterceptedAddListMemberPage({
  searchParams,
}: PageProps<"/i/lists/add_member">) {
  return (
    <Suspense fallback={null}>
      <AddMemberRoute searchParams={searchParams} dismiss="back" />
    </Suspense>
  );
}
