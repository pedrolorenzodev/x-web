import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";

export function BookmarksEmptyState() {
  return (
    <EmptyState
      title="Save posts for later"
      body="Bookmark posts to easily find them again in the future."
    />
  );
}

export function LikesEmptyState() {
  return (
    <EmptyState
      title="You don’t have any likes yet"
      body="Tap the heart on any post to show it some love. When you do, it’ll show up here."
    />
  );
}

export function BookmarksNoResults({ query }: { query: string }) {
  return (
    <EmptyState
      title={`No results for ${query}`}
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
