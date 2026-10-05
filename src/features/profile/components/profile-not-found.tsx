import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export function ProfileNotFound() {
  return (
    <>
      <PageHeader title="Profile" />
      <EmptyState
        title="This account doesn’t exist"
        body="Try searching for another."
        className="max-w-[360px] px-10"
      />
    </>
  );
}
