import { Suspense } from "react";
import { AdvancedSearchModal } from "@/features/search/components/advanced-search-modal";
import { readSearchParam } from "@/features/search/utils/search-tabs";

async function InterceptedAdvancedSearch({
  searchParams,
}: Pick<PageProps<"/search-advanced">, "searchParams">) {
  const query = readSearchParam((await searchParams).q);
  return <AdvancedSearchModal key={query} query={query} dismiss="back" />;
}

export default function InterceptedAdvancedSearchPage({
  searchParams,
}: PageProps<"/search-advanced">) {
  return (
    <Suspense fallback={null}>
      <InterceptedAdvancedSearch searchParams={searchParams} />
    </Suspense>
  );
}
