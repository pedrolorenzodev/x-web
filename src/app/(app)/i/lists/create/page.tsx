import type { Metadata } from "next";
import { Suspense } from "react";
import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { CreateListRoute } from "@/app/(app)/i/lists/_components/create-list-route";

export const metadata: Metadata = {
  title: "Create a new List / X",
};

export default function CreateListPage() {
  return (
    <>
      <HomePage />
      <Suspense fallback={null}>
        <CreateListRoute dismiss={{ replace: routes.home }} />
      </Suspense>
    </>
  );
}
