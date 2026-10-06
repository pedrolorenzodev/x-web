import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { routes } from "@/config/routes";
import { SpinnerRow } from "@/components/ui/spinner";
import { SearchRoute } from "@/app/(app)/search/_components/search-route";
import {
  parseSearchTab,
  readSearchParam,
} from "@/features/search/utils/search-tabs";

export async function generateMetadata({
  searchParams,
}: PageProps<"/search">): Promise<Metadata> {
  const query = readSearchParam((await searchParams).q).trim();
  return { title: query ? `${query} - Search / X` : "Search / X" };
}

async function Results({ searchParams }: Pick<PageProps<"/search">, "searchParams">) {
  const params = await searchParams;
  const query = readSearchParam(params.q).trim();
  if (!query) redirect(routes.explore);

  return (
    <SearchRoute
      source={{
        kind: "query",
        query,
        src: readSearchParam(params.src) || "typed_query",
      }}
      tab={parseSearchTab(readSearchParam(params.f))}
    />
  );
}

export default function SearchPage({ searchParams }: PageProps<"/search">) {
  return (
    <Suspense fallback={<SpinnerRow />}>
      <Results searchParams={searchParams} />
    </Suspense>
  );
}
