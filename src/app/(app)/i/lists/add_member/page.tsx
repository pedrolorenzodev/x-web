import type { Metadata } from "next";
import { Suspense } from "react";
import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { AddMemberRoute } from "@/app/(app)/i/lists/_components/add-member-route";

export const metadata: Metadata = {
  title: "Pick a List / X",
};

export default function AddListMemberPage({
  searchParams,
}: PageProps<"/i/lists/add_member">) {
  return (
    <>
      <HomePage />
      <Suspense fallback={null}>
        <AddMemberRoute
          searchParams={searchParams}
          dismiss={{ replace: routes.home }}
        />
      </Suspense>
    </>
  );
}
