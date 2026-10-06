import type { Metadata } from "next";
import { Suspense } from "react";
import { SpinnerRow } from "@/components/ui/spinner";
import { ExploreForYou } from "@/app/(app)/explore/_components/explore-for-you";

export const metadata: Metadata = {
  title: "Explore / X",
};

export default function ExplorePage() {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <ExploreForYou />
    </Suspense>
  );
}
