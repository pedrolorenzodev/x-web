import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

type PlaceholderScreenProps = {
  title: string;
  back?: boolean;
};

export function PlaceholderScreen({ title, back = false }: PlaceholderScreenProps) {
  return (
    <>
      <PageHeader title={title} back={back} />
      <EmptyState
        title="Coming soon"
        body={`${title} is part of an upcoming update of this clone.`}
      />
    </>
  );
}
