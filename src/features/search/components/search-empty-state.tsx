import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export function SearchEmptyState({ query }: { query: string }) {
  return (
    <EmptyState
      title={`No results for "${query}"`}
      body={
        <>
          Try searching for something else, or check your{" "}
          <Link href="/settings/search" className="text-accent hover:underline">
            Search settings
          </Link>{" "}
          to see if they’re protecting you from potentially sensitive content.
        </>
      }
    />
  );
}
