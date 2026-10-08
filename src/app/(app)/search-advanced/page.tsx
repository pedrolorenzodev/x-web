import { Suspense } from "react";
import HomePage from "@/app/(app)/page";
import { routes } from "@/config/routes";
import { AdvancedSearchModal } from "@/features/search/components/advanced-search-modal";
import { readSearchParam } from "@/features/search/utils/search-tabs";

export { metadata } from "@/app/(app)/page";

async function AdvancedSearchRoute({
  searchParams,
}: Pick<PageProps<"/search-advanced">, "searchParams">) {
  const query = readSearchParam((await searchParams).q);
  return (
    <AdvancedSearchModal query={query} dismiss={{ replace: routes.home }} />
  );
}

export default function AdvancedSearchPage({
  searchParams,
}: PageProps<"/search-advanced">) {
  return (
    <>
      <HomePage />
      <Suspense fallback={null}>
        <AdvancedSearchRoute searchParams={searchParams} />
      </Suspense>
    </>
  );
}
