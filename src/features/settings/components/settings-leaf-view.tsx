import { EmptyState } from "@/components/ui/empty-state";
import type { SettingsCategory } from "@/features/settings/types/settings";
import { SettingsDetailHeader } from "@/features/settings/components/settings-detail-header";

type SettingsLeafViewProps = {
  title: string;
  parent: SettingsCategory;
};

export function SettingsLeafView({ title, parent }: SettingsLeafViewProps) {
  return (
    <>
      <SettingsDetailHeader title={title} backHref={parent.href} />
      <EmptyState
        title="This setting isn’t available in this clone"
        body={`${title} lives under ${parent.title} on X. This clone recreates settings two levels deep.`}
      />
    </>
  );
}
