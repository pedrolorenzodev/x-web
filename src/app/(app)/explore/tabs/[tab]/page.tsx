import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { SpinnerRow } from "@/components/ui/spinner";
import { ExploreForYou } from "@/app/(app)/explore/_components/explore-for-you";
import { ExploreNews } from "@/app/(app)/explore/_components/explore-news";
import { ExploreTrending } from "@/app/(app)/explore/_components/explore-trending";

export const metadata: Metadata = {
  title: "Explore / X",
};

async function ExploreTab({ params }: Pick<PageProps<"/explore/tabs/[tab]">, "params">) {
  const { tab } = await params;
  if (tab === "for-you") redirect("/explore/tabs/for_you");
  if (tab === "for_you") return <ExploreForYou />;
  if (tab === "trending") return <ExploreTrending />;
  if (tab === "news") return <ExploreNews category="News" />;
  if (tab === "sports") return <ExploreNews category="Sports" />;
  if (tab === "entertainment") return <ExploreNews category="Entertainment" />;
  notFound();
}

export default function ExploreTabPage({ params }: PageProps<"/explore/tabs/[tab]">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <ExploreTab params={params} />
    </Suspense>
  );
}
