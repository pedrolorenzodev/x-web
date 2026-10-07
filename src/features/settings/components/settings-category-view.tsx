import type { SettingsCategory } from "@/features/settings/types/settings";
import { SettingsDetailHeader } from "@/features/settings/components/settings-detail-header";
import { SettingsLinkRow } from "@/features/settings/components/settings-link-row";
import { cn } from "@/lib/utils";

export function SettingsCategoryView({ category }: { category: SettingsCategory }) {
  return (
    <>
      <SettingsDetailHeader title={category.title} />
      <p className="px-4 py-3 text-xs text-muted">{category.description}</p>
      {category.sections.map((section, index) => (
        <section
          key={section.heading ?? index}
          className={cn(index > 0 && "border-t border-border")}
        >
          {section.heading ? (
            <h3 className="px-4 py-3 text-xl font-extrabold">{section.heading}</h3>
          ) : null}
          <div role="tablist" aria-label={section.heading ?? category.title}>
            {section.links.map((link) => (
              <SettingsLinkRow key={link.href} link={link} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
