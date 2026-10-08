import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export function ProfileNotFound({ title = "Profile" }: { title?: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        title="This account doesn’t exist"
        body="Try searching for another."
        className="max-w-[440px] px-10"
      />
    </>
  );
}
