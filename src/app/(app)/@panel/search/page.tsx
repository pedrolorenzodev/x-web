import { Suspense } from "react";
import { SearchPanel } from "@/app/(app)/@panel/_modules/search-panel";
import { readSearchParam } from "@/features/search/utils/search-tabs";

async function QuerySearchPanel({
  searchParams,
}: Pick<PageProps<"/search">, "searchParams">) {
  const params = await searchParams;
  const query = readSearchParam(params.q).trim();

  return (
    <SearchPanel
      source={{
        kind: "query",
        query,
        src: readSearchParam(params.src) || "typed_query",
      }}
      params={params}
    />
  );
}

export default function SearchPanelPage({
  searchParams,
}: PageProps<"/search">) {
  return (
    <Suspense fallback={null}>
      <QuerySearchPanel searchParams={searchParams} />
    </Suspense>
  );
}
